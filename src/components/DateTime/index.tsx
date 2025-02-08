import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, ButtonText } from "../ui/button";
import moment from "moment";

const DateTime: React.FC<XediDatePicker> = ({
  date,
  onChangeDate,
  placeholder,
}) => {
  const [initDate, setInitDate] = React.useState(date || new Date());
  const [value, setValue] = React.useState(
    date ? moment(date).format("hh:mm DD/MM/YYYY") : ""
  );
  const [modalVisible, setModalVisible] = React.useState(false);
  const onChange = (e: any, date: Date) => {
    setModalVisible(false);
    if (!date) return;
    setInitDate(date as Date);
    setValue(moment(date).format("hh:mm DD/MM/YYYY"));
    onChangeDate?.(date);
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-typography-300 justify-start px-2"
        onPress={() => setModalVisible(true)}
      >
        <ButtonText
          className={`text-start font-normal ${
            value ? "text-black" : "text-typography-300"
          }`}
        >
          {value ? value : placeholder || "Choose your date"}
        </ButtonText>
      </Button>
      {modalVisible && <DateTimePicker value={initDate} onChange={onChange} />}
    </>
  );
};

export default DateTime;
