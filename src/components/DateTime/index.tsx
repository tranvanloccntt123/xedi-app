import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, ButtonText } from "../ui/button";
import moment from "moment";
import { Platform } from "react-native";
import { HStack } from "../ui/hstack";

const DateTime: React.FC<XediDatePicker> = ({
  date,
  onChangeDate,
  placeholder,
  isDisabled,
  variant,
}) => {
  const [initDate, setInitDate] = React.useState(date || new Date());
  const [value, setValue] = React.useState(
    date ? moment(date).format("DD/MM/YYYY") : ""
  );
  const [timeValue, setTimeValue] = React.useState(
    date ? moment(date).format("hh:mm") : ""
  );

  const [dateModalVisible, setDateModalVisible] = React.useState(false);
  const [timeModalVisible, setTimeModalVisible] = React.useState(false);
  const onChange = (e: any, date: Date) => {
    //Android cannot set datetime in a time, so we must split to two modals
    setDateModalVisible(false);
    setTimeModalVisible(false);
    if (!date) return;
    setInitDate(date as Date);
    setValue(moment(date).format("DD/MM/YYYY"));
    setTimeValue(moment(date).format("hh:mm"));
    onChangeDate?.(date);
  };

  return (
    <>
      <HStack space="md">
        <Button
          disabled={isDisabled}
          variant={variant || "outline"}
          className="border-typography-300 justify-start px-2"
          onPress={() => setTimeModalVisible(true)}
        >
          <ButtonText
            className={`text-start font-normal ${
              isDisabled
                ? "text-typography-300"
                : timeValue
                ? "text-black"
                : "text-typography-300"
            }`}
          >
            {timeValue ? timeValue : "00:00"}
          </ButtonText>
        </Button>
        <Button
          disabled={isDisabled}
          variant={variant || "outline"}
          className="border-typography-300 justify-start px-2"
          onPress={() => setDateModalVisible(true)}
        >
          <ButtonText
            className={`text-start font-normal ${
              isDisabled
                ? "text-typography-300"
                : value
                ? "text-black"
                : "text-typography-300"
            }`}
          >
            {value ? value : placeholder || "Choose your date"}
          </ButtonText>
        </Button>
      </HStack>
      {dateModalVisible && (
        <DateTimePicker
          value={initDate}
          onChange={onChange}
          mode={Platform.OS === "ios" ? "datetime" : "date"}
        />
      )}
      {timeModalVisible && (
        <DateTimePicker
          value={initDate}
          onChange={onChange}
          mode={Platform.OS === "ios" ? "datetime" : "time"}
        />
      )}
    </>
  );
};

export default DateTime;
