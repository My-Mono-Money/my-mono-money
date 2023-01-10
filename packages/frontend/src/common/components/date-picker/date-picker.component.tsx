import React, { useState } from 'react';
import { Moment } from 'moment';
import { Box } from '@mui/system';
import { DayPickerRangeController, FocusedInputShape } from 'react-dates';
import 'react-dates/initialize';
import './date-picker.styles.css';
import { TextField } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

const DatePicker: React.FC = () => {
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(
    'startDate',
  );
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          pb: '20px',
        }}
      >
        <TextField
          id="start-date"
          variant="outlined"
          value={startDate?.format('DD.MM.YYYY') || ''}
        />
        <HorizontalRuleIcon color="action" />
        <TextField
          id="end-date"
          variant="outlined"
          value={endDate?.format('DD.MM.YYYY') || ''}
        />
      </Box>
      <DayPickerRangeController
        startDate={startDate}
        endDate={endDate}
        focusedInput={focusedInput}
        onDatesChange={({ startDate, endDate }) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }}
        onFocusChange={(focusedInput) => {
          setFocusedInput(focusedInput ? focusedInput : 'startDate');
        }}
        hideKeyboardShortcutsPanel
        isOutsideRange={() => false}
        initialVisibleMonth={null}
        numberOfMonths={2}
      />
    </Box>
  );
};

export default DatePicker;
