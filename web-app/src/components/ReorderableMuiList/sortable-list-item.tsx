import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { IconButton, ListItem, ListItemText, Paper } from '@mui/material';

export interface Item {
  id: string;
  label: string;
}

interface SortableListItemProps {
  item: Item;
  disabled?: boolean;
}

export function SortableListItem({
  item,
  disabled = false,
}: SortableListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <ListItem
      ref={setNodeRef}
      component={Paper}
      sx={{
        mb: 1,
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: disabled ? 'not-allowed' : 'default',
      }}
      secondaryAction={
        <IconButton
          edge='end'
          {...attributes}
          {...listeners}
          sx={{ cursor: disabled ? 'not-allowed' : 'grab' }}
          disabled={disabled}
        >
          {!disabled ? <DragIndicatorIcon /> : null}
        </IconButton>
      }
    >
      <ListItemText primary={item.label} />
    </ListItem>
  );
}
