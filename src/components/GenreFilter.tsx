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
            color: '#B8B8CD',
            marginTop: '-6px',
            '&.Mui-focused': {
              color: '#00E5FF',
            },
            background: 'transparent',
            fontWeight: 600,
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
                background: 'rgba(21, 21, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                mt: 1,
                '& .MuiList-root': {
                  padding: '8px',
                },
                '& .MuiMenuItem-root': {
                  borderRadius: 3,
                  margin: '4px 0',
                  transition: 'all 0.2s ease',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.15), rgba(0, 229, 255, 0.15))',
                    color: '#ffffff',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.25), rgba(0, 229, 255, 0.25))',
                    color: '#ffffff',
                    fontWeight: 700,
                  },
                },
              }
            }
          }}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            color: '#white',
            padding: '4px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 51, 102, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(255, 51, 102, 0.2)',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.08)',
              border: '2px solid',
              borderColor: '#00E5FF',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(0, 229, 255, 0.2)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiSelect-select': {
              color: '#ffffff',
              fontWeight: 600,
            },
            '& .MuiSvgIcon-root': {
              color: '#B8B8CD',
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