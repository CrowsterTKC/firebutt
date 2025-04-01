import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material';
import { ElementType, useCallback, useMemo, useState } from 'react';

import { EnhancedTableHead } from '../EnhancedTableHead';
import { EnhancedTableToolbar } from '../EnhancedTableToolbar';

export interface ComponentProps {
  handleClose: () => void;
  handleRefresh: () => void;
  open: boolean;
}

interface EnhancedTableInterface {
  id: string;
}

interface EnhancedTableProps<T extends EnhancedTableInterface> {
  addItemComponent?: ElementType;
  columns: EnhancedColumn<T>[];
  defaultColumnForOrderBy: keyof T;
  deleteItemComponent?: ElementType;
  editItemComponent?: ElementType;
  entityNameForTooltips?: string;
  handleRefresh?: () => void;
  onFilter?: (value: string) => void;
  rows: T[];
  tableTitle: string;
}

export interface EnhancedColumn<T> {
  component?: ElementType;
  disablePadding?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (value: any) => string;
  id: keyof T;
  label: string;
  numeric?: boolean;
}

export function EnhancedTable<T extends EnhancedTableInterface>({
  addItemComponent,
  columns,
  defaultColumnForOrderBy,
  deleteItemComponent,
  editItemComponent,
  entityNameForTooltips,
  handleRefresh,
  onFilter,
  rows,
  tableTitle,
}: EnhancedTableProps<T>) {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(defaultColumnForOrderBy);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = useCallback(
    (_: React.MouseEvent<unknown>, property: keyof T) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    },
    [rows]
  );

  const handleClick = useCallback(
    (_: React.MouseEvent<unknown>, id: string) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    },
    [selected]
  );

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const descendingComparator = useCallback((a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }, []);

  const getComparator = useCallback(
    <Key extends keyof T>(
      order: 'asc' | 'desc',
      orderBy: Key
    ): ((a: T, b: T) => number) => {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    },
    [descendingComparator]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = useMemo(
    () => (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0),
    [page, rows, rowsPerPage]
  );

  const selectedData = useMemo(
    () => rows.filter((row) => selected.includes(row.id)),
    [rows, selected]
  );

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [getComparator, order, orderBy, page, rows, rowsPerPage]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar<T>
          addItemComponent={addItemComponent}
          deleteItemComponent={deleteItemComponent}
          editItemComponent={editItemComponent}
          editItemComponentData={selectedData}
          entityNameForTooltips={entityNameForTooltips}
          numSelected={selected.length}
          handleRefresh={handleRefresh}
          onFilter={onFilter}
          tableTitle={tableTitle}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size='medium'
          >
            <EnhancedTableHead
              headCells={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    {columns.map(
                      ({ component: Component, formatter, id, numeric }) => {
                        if (Component) {
                          return (
                            <TableCell key={id as string}>
                              <Component value={row[id]} />
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell
                              key={id as string}
                              align={numeric ? 'right' : 'left'}
                            >
                              {formatter
                                ? formatter(row[id])
                                : (row[id] as string)}
                            </TableCell>
                          );
                        }
                      }
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={columns.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
