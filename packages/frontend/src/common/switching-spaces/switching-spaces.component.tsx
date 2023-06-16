import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useGlobalState } from 'global-state/use-global-state.hook';
import { useFetchSpaces } from 'api/useFetchSpaces';
import { axiosPrivate } from 'api/axios';

const SwitchingSpaces = () => {
  const { defaultUserSpace, setChangeDefaultUserSpace } = useGlobalState();

  const queryClient = useQueryClient();
  const spaces = useFetchSpaces();

  const { mutate: mutateChangeSpace, isError } = useMutation({
    mutationFn: (defaultSpace: string) =>
      axiosPrivate.patch(`/user`, { defaultSpace }),
    onSuccess: () => {
      queryClient.invalidateQueries(['spaces']);
    },
  });

  function changeDefaultSpace() {
    setChangeDefaultUserSpace(
      spaces?.data?.find((space) => space.isDefault === true)
        ?.spaceOwnerEmail || '',
    );
  }
  useEffect(() => {
    changeDefaultSpace();
  }, []);

  useEffect(() => {
    changeDefaultSpace();
  }, [spaces]);

  const handleChangeSpace = async (event: SelectChangeEvent) => {
  mutateChangeSpace(event.target.value);
  };

  return (
    <>
      <FormControl variant="standard" sx={{ ml: 2, minWidth: 120 }}>
        <InputLabel
          id="space-switching-select-label"
          variant="standard"
          htmlFor="uncontrolled-native"
        >
          Простір
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="space-switching-select"
          value={defaultUserSpace}
          label={defaultUserSpace}
          onChange={handleChangeSpace}
          disabled={Boolean(!spaces?.data || spaces?.data?.length <= 1)}
        >
          {spaces?.data?.map((space) => {
            return (
              <MenuItem
                key={space.spaceOwnerEmail}
                value={space.spaceOwnerEmail}
              >
                {space.spaceOwnerEmail}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {isError && (
        <Typography sx={{ mt: 2 }}>
          Помилка. Будь ласка, спробуйте пізніше
        </Typography>
      )}
    </>
  );
};

export default SwitchingSpaces;
