import {
  Delete as DeleteIcon,
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

interface EnhancedTableToolbarProps {
  numSelected: number;
  tableTitle: string;
}

export function EnhancedTableToolbar({
  numSelected,
  tableTitle,
}: EnhancedTableToolbarProps) {
  return (
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
        <Tooltip title='Delete'>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
