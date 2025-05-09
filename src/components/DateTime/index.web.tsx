import React from "react";
import DateTimePicker from "react-datetime-picker";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./styles.css";

const DateTime: React.FC<XediDatePicker> = ({ date, onChangeDate }) => {
  const [initDate, setInitDate] = React.useState(date || new Date());
  const onChange = (date: Date | [Date, Date] | null) => {
    if (!date) return;
    if (Array.isArray(date)) {
      if (date[0]) setInitDate(date[0]);
    }
    setInitDate(date as Date);
  };
  return (
    <DateTimePicker
      className={"p-2 border-[1.5px] rounded-md border-background-300"}
      value={initDate}
      onChange={onChange}
    />
  );
};

export default DateTime;
