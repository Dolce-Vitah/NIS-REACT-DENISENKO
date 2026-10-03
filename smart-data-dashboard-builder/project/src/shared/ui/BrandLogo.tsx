import { Box, Stack, Typography } from '@mui/material';

export function BrandLogo() {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #6D5EFC 0%, #14B8A6 100%)',
          boxShadow: '0 8px 18px rgba(109,94,252,.35)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 7,
            borderRadius: 1,
            border: '2px solid rgba(255,255,255,.9)',
            borderTopColor: 'transparent',
            transform: 'rotate(-18deg)',
          },
        }}
      />
      <Box>
        <Typography fontSize={16} fontWeight={800} lineHeight={1}>Nexlytics</Typography>
        <Typography fontSize={11} color="text.secondary" lineHeight={1.1}>Glass Pro Analytics</Typography>
      </Box>
    </Stack>
  );
}