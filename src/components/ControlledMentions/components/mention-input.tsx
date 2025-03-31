import React, {
  MutableRefObject,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from "react-native";
import {
  defaultMentionTextStyle,
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  isMentionPartType,
  parseValue,
} from "../utils";
import { Text } from "../../ui/text";
import { MentionInputProps, MentionInputRef, MentionPartType, Suggestion } from "../types";

export const regexWeb =
  /(((H|h)(T|t)(T|t)(P|p)(S|s)|(F|f)(T|t)(P|p)|(H|h)(T|t)(T|t)(P|p)):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

export const regexHashTag = /\B(\#[a-zA-Z0-9_]+\b)(?!;)/g;

const ContentRegex = [regexWeb, regexHashTag];

const MentionInput = forwardRef<MentionInputRef, MentionInputProps>(
  (
    {
      value,

      onChange,

      partTypes = [],

      inputRef: propInputRef,

      containerStyle,

      onSelectionChange,

      onTrigger,

      ...textInputProps
    },
    ref
  ) => {
    const textInput = useRef<TextInput | null>(null);

    const [selection, setSelection] = useState({ start: 0, end: 0 });

    const { plainText, parts } = useMemo(
      () => parseValue(value, partTypes),
      [value, partTypes]
    );

    const handleSelectionChange = (
      event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
    ) => {
      setSelection(event.nativeEvent.selection);

      onSelectionChange && onSelectionChange(event);
    };

    /**
     * Callback that trigger on TextInput text change
     *
     * @param changedText
     */
    const onChangeInput = (changedText: string) => {
      onChange(
        generateValueFromPartsAndChangedText(parts, plainText, changedText)
      );
    };

    /**
     * We memoize the keyword to know should we show mention suggestions or not
     */
    const keywordByTrigger = useMemo(() => {
      return getMentionPartSuggestionKeywords(
        parts,
        plainText,
        selection,
        partTypes
      );
    }, [parts, plainText, selection, partTypes]);

    useEffect(() => {
      onTrigger?.(keywordByTrigger);
    }, [parts, plainText, selection, partTypes, onTrigger, keywordByTrigger]);

    /**
     * Callback on mention suggestion press. We should:
     * - Get updated value
     * - Trigger onChange callback with new value
     */
    const onSuggestionPress =
      (mentionType: MentionPartType) => (suggestion: Suggestion) => {
        const newValue = generateValueWithAddedSuggestion(
          parts,
          mentionType,
          plainText,
          selection,
          suggestion
        );

        if (!newValue) {
          return;
        }

        onChange(newValue);

        /**
         * Move cursor to the end of just added mention starting from trigger string and including:
         * - Length of trigger string
         * - Length of mention name
         * - Length of space after mention (1)
         *
         * Not working now due to the RN bug
         */
        // const newCursorPosition = currentPart.position.start + triggerPartIndex + trigger.length +
        // suggestion.name.length + 1;

        // textInput.current?.setNativeProps({selection: {start: newCursorPosition, end: newCursorPosition}});
      };

    React.useImperativeHandle(
      ref,
      (): MentionInputRef => {
        return {
          setMentions(type, suggest) {
            const handler = onSuggestionPress(type);
            handler(suggest);
          },
        } as MentionInputRef;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [parts, plainText, selection, partTypes]
    );

    const handleTextInputRef = (_ref: TextInput) => {
      textInput.current = _ref as TextInput;

      if (propInputRef) {
        if (typeof propInputRef === "function") {
          propInputRef(_ref);
        } else {
          (propInputRef as MutableRefObject<TextInput>).current =
            _ref as TextInput;
        }
      }
    };

    const renderMentionSuggestions = (mentionType: MentionPartType) => (
      <React.Fragment key={mentionType.trigger}>
        {mentionType.renderSuggestions &&
          mentionType.renderSuggestions({
            keyword: keywordByTrigger[mentionType.trigger],
            onSuggestionPress: onSuggestionPress(mentionType),
          })}
      </React.Fragment>
    );

    const renderTextByRegex = (text: string, i?: number) => {
      if (ContentRegex[0].test(text)) {
        return (
          <Text className="text-info-500" key={`substring-${i}`}>
            {text}
          </Text>
        );
      } else if (ContentRegex[1].test(text)) {
        return (
          <Text className="text-info-500" key={`substring-${i}`}>
            {text}
          </Text>
        );
      }
      return <Text>{text}</Text>;
    };

    const renderText = (text: string) => {
      let newText = text;
      const lines: string[] =
        (newText.split(/\n/g) ?? []).reduce((v, current, index, arr): any => {
          let showText: string[] = current?.split(/\s/g) ?? [];
          return [
            ...v,
            ...showText?.reduce((_v, _current, _index, _arr): any => {
              return [..._v, _current, _index < _arr.length - 1 ? " " : ""];
            }, []),
            index < arr.length - 1 ? "\n" : "",
          ];
        }, []) ?? [];
      if (lines.length) {
        return lines.map((v, i) => renderTextByRegex(v, i));
      }
      return renderTextByRegex(text);
    };

    return (
      <View style={containerStyle}>
        <TextInput
          multiline
          {...textInputProps}
          scrollEnabled={false}
          ref={handleTextInputRef}
          onChangeText={onChangeInput}
          onSelectionChange={handleSelectionChange}
        >
          <Text>
            {parts.map(({ text, partType, data }, index) => {
              if (partType) {
                return (
                  <Text
                    key={`${index}-${data?.trigger ?? "pattern"}`}
                    style={partType.textStyle ?? defaultMentionTextStyle}
                  >
                    {text}
                  </Text>
                );
              }
              return <Text key={index}>{renderText(text)}</Text>;
            })}
          </Text>
        </TextInput>

        <View>
          {(
            partTypes.filter(
              (one) => isMentionPartType(one) && one.renderSuggestions != null
            ) as MentionPartType[]
          ).map(renderMentionSuggestions)}
        </View>
      </View>
    );
  }
);

export { MentionInput };
