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
        width: 340, 
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: 320, 
          height: 'calc(100% - 32px)', 
          top: 16, 
          right: 28, 
          borderRadius: '12px', 
          border: '1px solid #333', 
          
          boxSizing: 'border-box', 
          backgroundColor: 'rgba(10, 10, 16, 0.95)', 
          backdropFilter: 'blur(10px)',
          color: '#fff',
          boxShadow: '-5px 0 20px rgba(0,0,0,0.5)',
        },
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderTop: '2px solid #00f3ff',
        background: 'linear-gradient(180deg, rgba(0, 243, 255, 0.1) 0%, transparent 100%)'
      }}>
        <Typography variant="h6" sx={{ 
          fontFamily: 'Orbitron', 
          letterSpacing: 1, 
          color: '#00f3ff',
          textShadow: '0 0 5px rgba(0, 243, 255, 0.5)'
        }}>
          /// SYSTEM_LOGS
        </Typography>
        <Button 
          variant="outlined" 
          color="secondary" 
          size="small" 
          onClick={clearLogs} 
          sx={{ mt: 1, mb: 1, fontSize: '0.7rem' }}
        >
          [CLEAR_BUFFER]
        </Button>
      </Box>
      <Divider sx={{ borderColor: '#333' }} />
      
      <List sx={{ 
        overflowY: 'auto', 
        flexGrow: 1, 
        p: 0,
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#333' }
      }}>
        {logs.map((log) => (
          <ListItem 
            key={log.id} 
            divider 
            sx={{ 
              borderColor: 'rgba(255,255,255,0.05)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' }
            }}
          >
            <ListItemText 
              primary={
                <span style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ opacity: 0.5 }}>{log.timestamp}</span>
                  <span>{log.message}</span>
                </span>
              }
              primaryTypographyProps={{ 
                style: { 
                  fontFamily: '"Fira Code", monospace', 
                  fontSize: '0.75rem', 
                  color: getLogColor(log.type),
                  lineHeight: 1.4
                } 
              }}
            />
          </ListItem>
        ))}
        {logs.length === 0 && (
          <Box sx={{ p: 3, opacity: 0.3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              _NO_SIGNAL_DETECTED_
            </Typography>
          </Box>
        )}
      </List>
      
      <Box sx={{ p: 1, borderTop: '1px solid #333', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#444', fontFamily: 'monospace' }}>
          VER 2.0.77 :: CONNECTED
        </Typography>
      </Box>
    </Drawer>
  );
};

export default EventLog;