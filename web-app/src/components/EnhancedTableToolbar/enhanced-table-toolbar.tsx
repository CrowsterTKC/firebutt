import {
  Add as AddIcon,
  Delete as DeleteIcon,
  EditNote as EditNoteIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { ElementType, useCallback, useState } from 'react';

interface EnhancedTableToolbarProps<T> {
  addItemComponent?: ElementType;
  deleteItemComponent?: ElementType;
  editItemComponent?: ElementType;
  editItemComponentData?: T[];
  entityNameForTooltips?: string;
  numSelected: number;
  handleRefresh?: () => void;
  onFilter?: (value: string) => void;
  tableTitle: string;
}

export function EnhancedTableToolbar<T>({
  addItemComponent: AddItemComponent,
  deleteItemComponent: DeleteItemComponent,
  editItemComponent: EditItemComponent,
  editItemComponentData,
  entityNameForTooltips,
  numSelected,
  handleRefresh,
  onFilter,
  tableTitle,
}: EnhancedTableToolbarProps<T>) {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);

  const handleOpenAddItem = useCallback(() => {
    setIsAddItemOpen(true);
  }, [setIsAddItemOpen]);

  const handleCloseAddItem = useCallback(() => {
    setIsAddItemOpen(false);
  }, [setIsAddItemOpen]);

  const handleOpenEditItem = useCallback(() => {
    setIsEditItemOpen(true);
  }, [setIsEditItemOpen]);

  const handleCloseEditItem = useCallback(() => {
    setIsEditItemOpen(false);
  }, [setIsEditItemOpen]);

  const handleOpenDeleteItem = useCallback(() => {
    setIsDeleteItemOpen(true);
  }, [setIsDeleteItemOpen]);

  const handleCloseDeleteItem = useCallback(() => {
    setIsDeleteItemOpen(false);
  }, [setIsDeleteItemOpen]);

  return (
    <>
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          },
        ]}
      >
        <Box sx={{ flex: '1 1 100%' }}>
          <Typography variant='h6' id='tableTitle' component='div'>
            {tableTitle}
          </Typography>
          {numSelected > 0 && (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color='inherit'
              variant='subtitle1'
              component='div'
            >
              {numSelected} selected
            </Typography>
          )}
        </Box>
        {numSelected > 0 ? (
          <>
            {numSelected === 1 && EditItemComponent && (
              <Tooltip
                title={['Edit', entityNameForTooltips?.toLowerCase()].join(' ')}
              >
                <IconButton onClick={handleOpenEditItem}>
                  <EditNoteIcon />
                </IconButton>
              </Tooltip>
            )}
            {DeleteItemComponent && (
              <Tooltip
                title={['Delete', entityNameForTooltips?.toLowerCase()].join(
                  ' '
                )}
              >
                <IconButton onClick={handleOpenDeleteItem}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          <>
            {AddItemComponent && (
              <Tooltip
                title={['New', entityNameForTooltips?.toLowerCase()].join(' ')}
              >
                <IconButton onClick={handleOpenAddItem}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
            {onFilter && (
              <Tooltip title='Filter list'>
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Toolbar>
      {AddItemComponent && (
        <AddItemComponent
          handleClose={handleCloseAddItem}
          handleRefresh={handleRefresh}
          mode='add'
          open={isAddItemOpen}
        />
      )}
      {EditItemComponent && (
        <EditItemComponent
          formData={editItemComponentData?.[0]}
          handleClose={handleCloseEditItem}
          handleRefresh={handleRefresh}
          mode='edit'
          open={isEditItemOpen}
        />
      )}
      {DeleteItemComponent && (
        <DeleteItemComponent
          formData={editItemComponentData}
          handleClose={handleCloseDeleteItem}
          handleRefresh={handleRefresh}
          open={isDeleteItemOpen}
        />
      )}
    </>
  );
}
