import { Box } from '@mui/material';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IStatementItem } from '../../../types/statement-item.interface';

const columns: GridColDef[] = [
  { field: 'time', headerName: 'Дата та час', width: 150 },
  {
    field: 'description',
    headerName: 'Деталі транзакції',
    width: 800,
    editable: true,
  },
  {
    field: 'balance',
    headerName: 'Сума',
    width: 150,
    editable: true,
  },
];

interface StatementTableProps {
  data: IStatementItem[];
}

const StatementTable: React.FC<StatementTableProps> = ({ data }) => {
  return (
    <Box
      sx={{
        height: 800,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={15}
        sx={{ border: 'none' }}
      />
    </Box>
  );
};

export default StatementTable;
