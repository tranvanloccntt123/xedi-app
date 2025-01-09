import React from "react";
import DatePicker from "react-datepicker";

const DateTime: React.FC<XediDatePicker> = ({ date, onChangeDate }) => {
  const [initDate, setInitDate] = React.useState(date || new Date());
  const onChange = (date: Date | [Date, Date] | null) => {
    if (!date) return;
    if (Array.isArray(date)) {
      if (date[0]) setInitDate(date[0]);
    }
    setInitDate(date as Date);
  };
  return <DatePicker selected={initDate} onChange={onChange} />;
};

export default DateTime;
