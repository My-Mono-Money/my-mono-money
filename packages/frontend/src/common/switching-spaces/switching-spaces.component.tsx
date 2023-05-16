import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import axios, { AxiosError } from 'axios';
import { IErrorResponse } from '../../types/error-response.interface';
import { useGlobalState } from '../../global-state/use-global-state.hook';
import { IUserSpace } from '../../types/user-space.interface';
import { useFetchTokenList } from '../../api/useFetchTokenList';

const SwitchingSpaces = () => {
  const {
    defaultUserSpace = '',
    setChangeDefaultUserSpace,
    spaceMembers,
  } = useGlobalState();
  const [tokenList, fetchTokenList] = useFetchTokenList();
  const [spaces, setSpaces] = useState<IUserSpace[]>();
  const [filteredSpaces, setFilteredSpaces] = useState<IUserSpace[]>();
  const { token, user } = useAuthState();

  useEffect(() => {
    if (!spaceMembers) return;
    fetchTokenList();
    getSpaces();
  }, [spaceMembers]);

  useEffect(() => {
    if (!spaces || !user) return;

    if (tokenList && tokenList?.length < 1) {
      setFilteredSpaces(
        spaces.filter(
          (space: IUserSpace) => space.spaceOwnerEmail !== user?.email,
        ),
      );
    } else {
      setFilteredSpaces(spaces);
    }
  }, [spaces]);

  useEffect(() => {
    if (!filteredSpaces || !user) return;
    setChangeDefaultUserSpace(
      filteredSpaces.find((space) => space.isDefault === true)
        ?.spaceOwnerEmail || '',
    );
  }, [filteredSpaces]);

  const getSpaces = async () => {
    try {
      const result = await axios.get(`/spaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSpaces(result.data.items);
      return result.data.items;
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data.message);
    }
  };
  const handleChangeSpace = async (event: SelectChangeEvent) => {
    setChangeDefaultUserSpace(event.target.value as string);

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
        disabled={Boolean(filteredSpaces && filteredSpaces.length <= 1)}
      >
        {filteredSpaces?.map((space) => {
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
