import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { Box, Divider, Menu, MenuItem } from '@mui/material';
import type { DashboardBookmark } from '../../../../entities/dashboard/types';

type BookmarksMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  bookmarks: DashboardBookmark[];
  labels: {
    saveCurrentView: string;
    noBookmarksYet: string;
  };
  removeBookmarkLabel: (bookmarkName: string) => string;
  onSaveBookmark: () => void;
  onLoadBookmark: (bookmarkId: string) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
};

export function BookmarksMenu({
  anchorEl,
  open,
  onClose,
  bookmarks,
  labels,
  removeBookmarkLabel,
  onSaveBookmark,
  onLoadBookmark,
  onDeleteBookmark,
}: BookmarksMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MenuItem
        onClick={() => {
          onClose();
          onSaveBookmark();
        }}
      >
        <BookmarkAddOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        {labels.saveCurrentView}
      </MenuItem>
      <Divider />
      {bookmarks.length === 0 ? (
        <MenuItem disabled>{labels.noBookmarksYet}</MenuItem>
      ) : (
        bookmarks.map((bookmark) => (
          <Box key={bookmark.id}>
            <MenuItem
              onClick={() => {
                onClose();
                onLoadBookmark(bookmark.id);
              }}
            >
              <FolderOpenOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              {bookmark.name}
            </MenuItem>
            <MenuItem
              onClick={() => {
                onClose();
                onDeleteBookmark(bookmark.id);
              }}
              sx={{ color: 'error.main', fontSize: 13, pl: 5 }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              {removeBookmarkLabel(bookmark.name)}
            </MenuItem>
          </Box>
        ))
      )}
    </Menu>
  );
}
