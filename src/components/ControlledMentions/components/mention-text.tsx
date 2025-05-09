import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { defaultMentionTextStyle, parseValue } from "../utils";
import { wrapTextStyle } from "@/src/theme/AppStyles";
import AppColors from "@/src/constants/colors";

export const regexWeb =
  /(((H|h)(T|t)(T|t)(P|p)(S|s)|(F|f)(T|t)(P|p)|(H|h)(T|t)(T|t)(P|p)):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

export const regexHashTag = /\B(\#[a-zA-Z0-9_]+\b)(?!;)/g;

const ContentRegex = [regexWeb, regexHashTag];

const MentionText = ({
  value,

  partTypes,

  containerStyle,

  textStyle,
}: {
  value: string;
  partTypes?: any;
  containerStyle?: any;
  textStyle?: any;
}) => {
  const { parts } = useMemo(
    () => parseValue(value, partTypes || []),
    [value, partTypes]
  );

  const renderTextByRegex = (text: string, i?: number) => {
    if (ContentRegex[0].test(text)) {
      return (
        <Text
          key={`substring-${i}`}
          style={wrapTextStyle(
            {
              fontWeight: "500",
              fontStyle: "italic",
              color: AppColors.primary,
            },
            "2xs"
          )}
        >
          {text}
        </Text>
      );
    } else if (ContentRegex[1].test(text)) {
      return (
        <Text
          key={`substring-${i}`}
          style={wrapTextStyle(
            {
              fontWeight: "500",
              fontStyle: "italic",
              color: AppColors.primary,
            },
            "2xs"
          )}
        >
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
      <Text style={textStyle}>
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
          return (
            <Text key={index} style={textStyle}>
              {renderText(text)}
            </Text>
          );
        })}
      </Text>
    </View>
  );
};

export default MentionText;
