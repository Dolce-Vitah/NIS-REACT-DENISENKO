import { Box, Stack, Typography, useTheme } from '@mui/material';

export function BrandLogo() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          position: 'relative',
          width: 34,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            left: 2,
            top: 4,
            boxShadow: '0 4px 10px rgba(102, 126, 234, 0.4)',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(52, 211, 153, 0.5) 100%)',
            right: 2,
            bottom: 4,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '0.5px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#ffffff',
            top: 6,
            left: 6,
            filter: 'blur(1px)',
            opacity: 0.8,
          }}
        />
      </Box>

      <Box>
        <Typography
          fontSize={17}
          fontWeight={800}
          lineHeight={1}
          sx={{
            letterSpacing: '-0.02em',
            background: isDark
              ? 'linear-gradient(90deg, #fff 0%, #a8b8d0 100%)'
              : 'linear-gradient(90deg, #1a1a2e 0%, #5a5a7a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          PrismData
        </Typography>
        <Typography
          fontSize={11}
          color="text.secondary"
          lineHeight={1.2}
          fontWeight={500}
          sx={{ letterSpacing: '0.04em', opacity: 0.8 }}
        >
          Intelligence Hub
        </Typography>
      </Box>
    </Stack>
  );
}
