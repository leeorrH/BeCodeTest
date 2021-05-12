import React, {useState} from 'react';
import 'date-fns';
// import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


function DatePicker({testDate, handleChange, id, formatDate}) {
  const [selectedDate, setSelectedDate] = useState(new Date(testDate));

  const handleDateChange = (date) => {
    let formatedDate = formatDate(date);
    setSelectedDate(date);
    handleChange(formatedDate,'test_date',id);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Date picker inline"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  )
}

export default DatePicker
