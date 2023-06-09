import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
  const { defaultUserSpace, setChangeDefaultUserSpace } = useGlobalState();

  const { token } = useAuthState();
  const queryClient = useQueryClient();
  const spaces = useFetchSpaces();
  useEffect(() => {
    setChangeDefaultUserSpace(
      spaces?.data?.find((space) => space.isDefault === true)
        ?.spaceOwnerEmail || '',
    );
  }, []);

  useEffect(() => {
    setChangeDefaultUserSpace(
      spaces?.data?.find((space) => space.isDefault === true)
        ?.spaceOwnerEmail || '',
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
      queryClient.invalidateQueries(['spaces']);
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      console.log(axiosError.response?.data.message);
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
        disabled={Boolean(!spaces?.data || spaces?.data?.length <= 1)}
      >
        {spaces?.data?.map((space) => {
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
