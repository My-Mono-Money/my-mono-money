import React, { useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import axios, { AxiosError } from 'axios';
import { IErrorResponse } from 'types/error-response.interface';
import { useGlobalState } from 'global-state/use-global-state.hook';
import { useFetchSpaces } from 'api/useFetchSpaces';

const SwitchingSpaces = () => {
  const {
    defaultUserSpace = '',
    setChangeDefaultUserSpace,
    spaceMembers,
    spaces,
  } = useGlobalState();
  const [, fetchSpaces] = useFetchSpaces();
  const { token } = useAuthState();

  useEffect(() => {
    if (!spaceMembers) return;
    fetchSpaces();
  }, []);

  useEffect(() => {
    if (!spaces) return;
    setChangeDefaultUserSpace(
      spaces.find((space) => space.isDefault === true)?.spaceOwnerEmail || '',
    );
  }, [spaces]);

  const handleChangeSpace = async (event: SelectChangeEvent) => {
    try {
      await axios.patch(
        `/user`,
        { defaultSpace: event.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchSpaces();
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data.message);
    }
  };

  return (
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
        disabled={Boolean(spaces && spaces.length <= 1)}
      >
        {spaces?.map((space) => {
          return (
            <MenuItem key={space.spaceOwnerEmail} value={space.spaceOwnerEmail}>
              {space.spaceOwnerEmail}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SwitchingSpaces;
