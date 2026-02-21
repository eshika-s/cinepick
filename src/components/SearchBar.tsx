import { useState } from 'react'
import { TextField, InputAdornment, Box } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <Box className="fade-in">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search movies..."
        value={query}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#B8B8CD' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 51, 102, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00E5FF',
              borderWidth: '2px',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
            padding: '12px 14px',
          },
          '& .MuiInputLabel-root': {
            color: '#B8B8CD',
            '&.Mui-focused': {
              color: '#00E5FF',
            }
          }
        }}
      />
    </Box>
  )
}