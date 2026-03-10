import { Box, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';

type GuideDialogProps = {
  open: boolean;
  onClose: () => void;
  ru: boolean;
  title: string;
};

export function GuideDialog({ open, onClose, ru, title }: GuideDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          <Box>
            <strong>{ru ? '1) Импорт данных' : '1) Import data'}</strong>
            <Box sx={{ color: 'text.secondary' }}>
              {ru ? (
                <>
                  Нажмите <strong>Загрузить</strong> и выберите CSV/JSON файл с табличными данными.
                </>
              ) : (
                <>
                  Use <strong>Upload</strong> and select CSV/JSON file with tabular records.
                </>
              )}
            </Box>
          </Box>
          <Box>
            <strong>{ru ? '2) Сборка дашборда' : '2) Build dashboard'}</strong>
            <Box sx={{ color: 'text.secondary' }}>
              {ru
                ? 'Добавляйте виджеты слева, размещайте их на канвасе и настраивайте поля справа.'
                : 'Add widgets from the left panel, arrange them on canvas, and configure fields in the right panel.'}
            </Box>
          </Box>
          <Box>
            <strong>{ru ? '3) Исследование в Discover' : '3) Explore in Discover'}</strong>
            <Box sx={{ color: 'text.secondary' }}>
              {ru ? (
                <>
                  Переключитесь в режим <strong>Discover</strong>, используйте строку запроса/фильтр
                  времени и анализируйте статистику полей (топ значений, перцентили, гистограмма).
                </>
              ) : (
                <>
                  Switch to <strong>Discover</strong> mode, use query bar/time filter, and analyze
                  field stats (top values, percentiles, histogram).
                </>
              )}
            </Box>
          </Box>
          <Box>
            <strong>{ru ? '4) Сохранение и восстановление' : '4) Save and restore work'}</strong>
            <Box sx={{ color: 'text.secondary' }}>
              {ru ? (
                <>
                  Используйте <strong>Рабочее пространство - Сохранить/Загрузить</strong> и{' '}
                  <strong>Закладки</strong> для сохранения снимков текущего вида.
                </>
              ) : (
                <>
                  Use <strong>Workspace - Save/Load</strong> and <strong>Bookmarks</strong> to keep
                  snapshots of current view.
                </>
              )}
            </Box>
          </Box>
          <Box>
            <strong>{ru ? '5) Экспорт' : '5) Export'}</strong>
            <Box sx={{ color: 'text.secondary' }}>
              {ru
                ? 'Экспортируйте отфильтрованные данные в CSV, конфигурацию в JSON и изображение в PNG/PDF.'
                : 'Export filtered data as CSV, dashboard config as JSON, and visual output as PNG/PDF.'}
            </Box>
          </Box>
          <Box>
            <strong>{ru ? 'Горячие клавиши' : 'Hotkeys'}</strong>
            <Box sx={{ color: 'text.secondary' }}>
              {ru
                ? 'Ctrl+S сохранить, Ctrl+L загрузить, Ctrl+Z отмена, Ctrl+Shift+Z/Ctrl+Y повтор.'
                : 'Ctrl+S save, Ctrl+L load, Ctrl+Z undo, Ctrl+Shift+Z/Ctrl+Y redo.'}
            </Box>
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: 13 }}>
            {ru ? (
              <>
                Полная документация доступна в <code>docs/user-guide.md</code>.
              </>
            ) : (
              <>
                Full detailed documentation is available in <code>docs/user-guide.md</code>.
              </>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
