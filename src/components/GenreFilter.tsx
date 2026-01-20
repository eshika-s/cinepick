import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box } from '@mui/material'
import { genreMap } from '../utils/genreMap';

interface GenreFilterProps {
  selectedGenre: string
  onGenreChange: (genre: string) => void
}

export default function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onGenreChange(event.target.value as string)
  }

  return (
    <Box className="fade-in">
      <FormControl fullWidth>
        <InputLabel 
          sx={{
            color: '#9ca3af',
            '&.Mui-focused': {
              color: '#6366f1',
            },
            background: 'transparent',
            fontWeight: 500,
          }}
        >
          Genre
        </InputLabel>
        <Select
          value={selectedGenre}
          label="Genre"
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              sx: {
                background: 'rgba(17, 24, 39, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                mt: 1,
                '& .MuiList-root': {
                  padding: '8px',
                },
                '& .MuiMenuItem-root': {
                  borderRadius: 2,
                  margin: '2px 0',
                  transition: 'all 0.2s ease',
                  color: '#e5e7eb',
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  '&:hover': {
                    background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                    color: '#ffffff',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3))',
                    color: '#ffffff',
                    fontWeight: 600,
                  },
                },
              }
            }
          }}
          sx={{
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            color: '#e5e7eb',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            },
            '&.Mui-focused': {
              background: 'rgba(17, 24, 39, 0.95)',
              border: '2px solid',
              borderColor: 'primary.main',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(99, 102, 241, 0.3)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiSelect-select': {
              color: '#e5e7eb',
              fontWeight: 500,
            },
            '& .MuiSvgIcon-root': {
              color: '#9ca3af',
            },
          }}
        >
          <MenuItem value="all">All Genres</MenuItem>
          {Object.values(genreMap).map((genre) => (
            <MenuItem key={genre} value={genre}>
              {genre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}