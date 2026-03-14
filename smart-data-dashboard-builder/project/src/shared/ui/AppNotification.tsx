import { Alert, Snackbar } from '@mui/material';
import { useUiStore } from '../../store/uiStore';

export function AppNotification() {
  const notification = useUiStore((s) => s.notification);
  const clear = useUiStore((s) => s.clearNotification);

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={2500}
      onClose={clear}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {notification ? (
        <Alert onClose={clear} severity={notification.type} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
