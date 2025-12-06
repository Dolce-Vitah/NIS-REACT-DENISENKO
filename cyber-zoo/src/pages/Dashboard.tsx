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
      <header style={{ marginBottom: '2rem', borderBottom: '2px solid #00f3ff', paddingBottom: '1rem' }}>
        <Typography variant="h3" component="h1" sx={{ fontFamily: 'Orbitron', color: '#fff' }}>
          CyberZoo <span style={{ color: '#00f3ff' }}>2077</span> Dashboard
        </Typography>
      </header>

      <Box sx={{ mb: 4 }}>
        <FormControl variant="filled" sx={{ minWidth: 200, background: 'white', borderRadius: 1 }}>
          <InputLabel id="species-select-label">Filter Species</InputLabel>
          <Select
            labelId="species-select-label"
            value={filterSpecies}
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All Species</MenuItem>
            <MenuItem value="CyberCat">CyberCat</MenuItem>
            <MenuItem value="RoboDog">RoboDog</MenuItem>
            <MenuItem value="MechaBird">MechaBird</MenuItem>
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
            <Box key={index}>
              <Skeleton variant="rectangular" height={300} sx={{ bgcolor: 'grey.900', borderRadius: 2 }} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" sx={{ bgcolor: 'grey.800' }} />
                <Skeleton width="40%" sx={{ bgcolor: 'grey.800' }} />
              </Box>
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