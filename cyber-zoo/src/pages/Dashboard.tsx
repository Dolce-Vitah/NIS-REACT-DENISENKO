import React, { useEffect, useState, useMemo } from 'react';
import { 
  Skeleton, 
  Container, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  type SelectChangeEvent, 
  Box 
} from '@mui/material';
import PetCard from '../components/PetCard/PetCard';
import { type Pet, MOCK_PETS } from '../data/pets';

const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSpecies, setFilterSpecies] = useState<string>('All');

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPets(MOCK_PETS);
      setLoading(false);
    };
    fetchPets();
  }, []);

  const filteredPets = useMemo(() => {
    if (filterSpecies === 'All') return pets;
    return pets.filter((p) => p.species === filterSpecies);
  }, [pets, filterSpecies]);

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterSpecies(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <header style={{ 
        marginBottom: '3rem', 
        borderBottom: '1px solid rgba(0, 243, 255, 0.3)', 
        paddingBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div>
          <Typography variant="overline" sx={{ color: '#00f3ff', letterSpacing: '3px' }}>
            /// SYSTEM_READY
          </Typography>
          <Typography variant="h3" component="h1" sx={{ 
            fontFamily: 'Orbitron', 
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
          }}>
            CYBER<span style={{ color: '#00f3ff' }}>ZOO</span>_2077
          </Typography>
        </div>
        
        <div style={{ textAlign: 'right', opacity: 0.7 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            SECTOR: 7G
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            STATUS: ONLINE
          </Typography>
        </div>
      </header>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace' }}>
            [FILTER_PROTOCOL]
          </Typography>

          <FormControl variant="filled" sx={{ minWidth: 220 }}>
            <InputLabel 
              id="species-select-label"
              sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#00f3ff' } }}
            >
              SELECT_SPECIES
            </InputLabel>
            <Select
              labelId="species-select-label"
              value={filterSpecies}
              onChange={handleFilterChange}
              sx={{
                color: '#fff',
                fontFamily: 'Orbitron',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)',
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    border: '1px solid #00f3ff',
                    boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)',
                    '& .MuiMenuItem-root': {
                      fontFamily: 'Rajdhani',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 243, 255, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 243, 255, 0.2)',
                        color: '#00f3ff',
                        '&:hover': { backgroundColor: 'rgba(0, 243, 255, 0.3)' }
                      }
                    }
                  }
                }
              }}
            >
            <MenuItem value="All">All Species</MenuItem>
            <MenuItem value="CyberCat">CyberCat</MenuItem>
            <MenuItem value="RoboDog">RoboDog</MenuItem>
            <MenuItem value="MechaBird">MechaBird</MenuItem>
            <MenuItem value="QuantumPanda">QuantumPanda</MenuItem>
            <MenuItem value="NanoFox">NanoFox</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3, 
        }}
      >
        {loading ? (
          Array.from(new Array(3)).map((_, index) => (
            <Box 
              key={index} 
              sx={{ 
                border: '1px solid #333', 
                p: 2, 
                borderRadius: 1,
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <Skeleton 
                variant="circular" 
                width={110} 
                height={110} 
                sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(0, 243, 255, 0.1)' }} 
              />
              
              <Skeleton 
                height={30} 
                width="60%" 
                sx={{ mx: 'auto', mb: 1, bgcolor: 'rgba(255,255,255,0.05)' }} 
              />
              
              <Skeleton height={20} width="100%" sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.05)' }} />
              <Skeleton height={20} width="80%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
            </Box>
          ))
        ) : (
          filteredPets.map((pet) => (
            <PetCard key={pet.id} initialData={pet} />
          ))
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;