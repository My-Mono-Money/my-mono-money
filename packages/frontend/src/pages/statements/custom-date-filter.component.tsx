import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { Box } from '@mui/system';
import { DayPickerRangeController, FocusedInputShape } from 'react-dates';
import 'react-dates/initialize';
import './custom-date-filter.styles.css';
import { Button, TextField } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { useSearchParams } from 'react-router-dom';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

interface CustomDateFilterProps {
  closePopover: () => void;
}

const getDatesFromSearchParams = (searchParams: URLSearchParams) => {
  if (!searchParams.get('period')?.includes('--')) {
    return [null, null];
  }

  const parts = searchParams.get('period')?.split('--') || [];
  return [
    parts[0] ? moment(new Date(parts[0])) : null,
    parts[1] ? moment(new Date(parts[1])) : null,
  ];
};

const CustomDateFilter: React.FC<CustomDateFilterProps> = ({
  closePopover,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initalStartDate, initialEndDate] =
    getDatesFromSearchParams(searchParams);
  const [startDate, setStartDate] = useState<Moment | null>(initalStartDate);
  const [endDate, setEndDate] = useState<Moment | null>(initialEndDate);
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(
    'startDate',
  );

  const handleApplyClick = () => {
    if (!startDate || !endDate) {
      return;
    }
    const nextCustomPeriod = `${startDate?.format(
      'YYYY.MM.DD',
    )}--${endDate?.format('YYYY.MM.DD')}`;
    searchParams.set('period', nextCustomPeriod);
    searchParams.delete('page');
    setSearchParams(searchParams);
    closePopover();
  };

  const handleCancelClick = () => {
    closePopover();
  };

  return (
    <Box
      sx={{
        pt: '10px',
        pb: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          pb: '30px',
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
      <Box
        sx={{
          height: '110px',
          display: 'flex',
          alignItems: 'center',
          pl: '30px',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<DoneIcon />}
          color="inherit"
          disabled={!startDate || !endDate}
          onClick={handleApplyClick}
        >
          Прийняти
        </Button>
        <Button
          onClick={handleCancelClick}
          variant="outlined"
          color="inherit"
          startIcon={<ClearIcon />}
          sx={{
            ml: '30px',
          }}
        >
          Скасувати
        </Button>
      </Box>
    </Box>
  );
};

export default CustomDateFilter;
