import React, { useState } from 'react';
import {
  Box,
  List,
  Button,
  Divider,
  Popover,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CustomDateFilter from './custom-date-filter.component';

const OPTIONS_LIST = [
  { text: 'Сьогодні', value: 'day' },
  { text: 'Вчора', value: 'day:-1' },
  { text: 'Поточний тиждень', value: 'week' },
  { text: 'Минулий тиждень', value: 'week:-1' },
  { text: 'Поточний місяць', value: 'month' },
  { text: 'Минулий місяць', value: 'month:-1' },
  { text: 'Поточний квартал', value: 'quarter' },
  { text: 'Минулий квартал', value: 'quarter:-1' },
  { text: 'Поточний рік', value: 'year' },
  { text: 'Минулий рік', value: 'year:-1' },
];

const PeriodFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCustomPeriodSelected, setIsCustomPeriodSelected] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const selectedOption =
    OPTIONS_LIST.find(
      (itemOption) => itemOption.value === searchParams.get('period'),
    ) || (isCustomPeriodSelected ? undefined : OPTIONS_LIST[0]);

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const selectPeriod = (event: React.MouseEvent) => {
    const nextPeriod = event.currentTarget.getAttribute('data-value');
    if (!nextPeriod) {
      return;
    }
    searchParams.set('period', nextPeriod);
    searchParams.delete('page');
    if (searchParams.get('period') === 'day') {
      searchParams.delete('period');
    }
    setSearchParams(searchParams);
    setIsCustomPeriodSelected(false);
    closePopover();
  };

  const selectCustomPeriod = () => {
    searchParams.delete('period');
    setSearchParams(searchParams);
    setIsCustomPeriodSelected(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <Button
        aria-describedby={id}
        onClick={openPopover}
        variant="outlined"
        color="inherit"
        startIcon={<CalendarTodayIcon />}
      >
        {selectedOption ? selectedOption.text : 'Оберіть період'}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          mt: '10px',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <List sx={{ p: 0 }}>
            {OPTIONS_LIST.map((itemOption, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  onClick={selectPeriod}
                  sx={{ px: 2, py: 1 }}
                  selected={itemOption === selectedOption}
                  data-value={itemOption.value}
                >
                  <ListItemText primary={itemOption.text} />
                </ListItemButton>
                {index % 2 === 1 && <Divider />}
              </React.Fragment>
            ))}
            <ListItemButton
              onClick={selectCustomPeriod}
              sx={{ px: 2, py: 1 }}
              selected={isCustomPeriodSelected}
            >
              <ListItemText primary={'Оберіть період'} />
            </ListItemButton>
          </List>
          {selectedOption?.text === undefined && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                minWidth: '620px',
                p: 3,
              }}
            >
              <CustomDateFilter closePopover={closePopover} />
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default PeriodFilter;
