import React from 'react'
import { Box, Typography, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material'
import { AccountCircle, Logout } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

export default function UserMenu() {
  const { state, logout } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
  }

  if (!state.isAuthenticated) {
    return null // Will be handled by parent component
  }

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {state.user?.avatar ? (
          <Avatar src={state.user.avatar} alt={state.user.username} />
        ) : (
          <AccountCircle />
        )}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled>
          <Typography variant="body2" noWrap>
            {state.user?.email}
          </Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="body2" noWrap>
            {state.user?.firstName} {state.user?.lastName}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}
