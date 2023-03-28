import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePagination = (): [number, (page: number) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.has('page')
    ? Number(searchParams.get('page')) - 1
    : 0;
  const setPage = useCallback(
    (page: number) => {
      searchParams.set('page', (page + 1).toString());
      if (Number(searchParams.get('page')) === 1) {
        searchParams.delete('page');
      }
      setSearchParams(searchParams);
    },
    [searchParams],
  );

  return [page, setPage];
};
