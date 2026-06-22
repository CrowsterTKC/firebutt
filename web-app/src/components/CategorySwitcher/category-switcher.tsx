import {
  Add as AddIcon,
  Edit as EditIcon,
  Reorder as ReorderIcon,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import { useCallback, useState } from 'react';
import semver from 'semver';

import { useCategory } from '../../hooks/use-category';
import { useVersion } from '../../hooks/use-version';
import { AddEditCategoryDialog, ReorderCategoryDialog } from '../Dialogs';

export function CategorySwitcher() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    refreshCategories,
  } = useCategory();
  const { scriptVersion } = useVersion();

  const [isAddEditItemOpen, setIsAddEditItemOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleSelectedCategoryChange = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
    },
    [setSelectedCategory]
  );

  const handleOpenAddItem = useCallback(() => {
    setModalMode('add');
    setIsAddEditItemOpen(true);
  }, [setIsAddEditItemOpen]);

  const handleOpenEditItem = useCallback(() => {
    setModalMode('edit');
    setIsAddEditItemOpen(true);
  }, [setIsAddEditItemOpen]);

  const handleCloseAddEditItem = useCallback(() => {
    setIsAddEditItemOpen(false);
  }, [setIsAddEditItemOpen]);

  const handleOpenReorder = useCallback(() => {
    setIsReorderOpen(true);
  }, [setIsReorderOpen]);

  const handleCloseReorder = useCallback(() => {
    setIsReorderOpen(false);
  }, [setIsReorderOpen]);

  const handleRefresh = useCallback(() => {
    refreshCategories();
  }, [refreshCategories]);

  switch (true) {
    case semver.satisfies(scriptVersion, '>=2.0.0'):
      return (
        <>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              mb: 2,
              mt: 1,
            }}
          >
            <InputLabel id='category-switcher-label' sx={{ mr: 2 }}>
              Phrase Set:
            </InputLabel>
            <Select
              labelId='category-switcher-label'
              key='category-switcher'
              value={selectedCategory}
              variant='standard'
              onChange={(e) => handleSelectedCategoryChange(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name} {!category.isEnabled && '(Disabled)'}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title='Add Phrase Set' placement='top'>
              <IconButton onClick={handleOpenAddItem}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit Phrase Set' placement='top'>
              <IconButton
                onClick={handleOpenEditItem}
                disabled={
                  selectedCategory === '00000000-0000-0000-0000-000000000000'
                }
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Reorder Phrase Sets' placement='top'>
              <IconButton onClick={handleOpenReorder}>
                <ReorderIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <AddEditCategoryDialog
            open={isAddEditItemOpen}
            handleClose={handleCloseAddEditItem}
            mode={modalMode}
            formData={
              modalMode === 'edit'
                ? categories.find((c) => c.id === selectedCategory)
                : undefined
            }
            handleRefresh={handleRefresh}
          />
          <ReorderCategoryDialog
            open={isReorderOpen}
            handleClose={handleCloseReorder}
            handleRefresh={handleRefresh}
          />
        </>
      );
    default:
      return <></>;
  }
}
