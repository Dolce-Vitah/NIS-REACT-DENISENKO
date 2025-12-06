import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button, Box, Divider } from '@mui/material';
import { useEventLog } from '../../hooks/useEventLog';

const EventLog: React.FC = () => {
  const { logs, clearLogs } = useEventLog();

  const getLogColor = (type: string) => {
    switch (type) {
      case 'alert': return '#ff4d4f';  
      case 'success': return '#52c41a';
      default: return '#00f3ff';        
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: 320,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: 320, 
          boxSizing: 'border-box', 
          backgroundColor: '#121212', 
          color: '#fff',
          borderLeft: '1px solid #333'
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: 'Orbitron', letterSpacing: 1 }}>SYSTEM LOGS</Typography>
        <Button variant="outlined" color="secondary" size="small" onClick={clearLogs} sx={{ mt: 1, mb: 1 }}>
          Clear Logs
        </Button>
      </Box>
      <Divider sx={{ borderColor: '#333' }} />
      <List sx={{ overflowY: 'auto', flexGrow: 1, p: 0 }}>
        {logs.map((log) => (
          <ListItem key={log.id} divider sx={{ borderColor: '#222' }}>
            <ListItemText 
              primary={`[${log.timestamp}] ${log.message}`} 
              primaryTypographyProps={{ 
                style: { 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  color: getLogColor(log.type) 
                } 
              }}
            />
          </ListItem>
        ))}
        {logs.length === 0 && (
          <Typography sx={{ p: 2, color: '#555', fontStyle: 'italic', fontSize: '0.8rem' }}>
            _waiting for signals...
          </Typography>
        )}
      </List>
    </Drawer>
  );
};

export default EventLog;