import React from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTime: React.FC<XediDatePicker> = ({ date, onChangeDate }) => {
  const [initDate, setInitDate] = React.useState(date || new Date());
  const onChange = (e: any, date: Date) => {
    if (!date) return;
    setInitDate(date as Date);
  };
  return <DateTimePicker value={initDate} onChange={onChange} />;
};

export default DateTime;
