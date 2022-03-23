import React, { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import { IconButton, MenuItem } from '@mui/material';
import Container from '@mui/material/Container';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/Theme';
import {
  darkBackground, darkBorder, lightBackground, lightBorder,
} from '../../styles/Theme';
import { FontColor, Title } from './Texts';
import ThemeButton from './ThemeButton';
import { useAuth } from '../../contexts/Auth';

interface TabSchema {
  title: string;
  route: string;
  color?: FontColor;
}

const defaultMenuItems: TabSchema[] = [
  {
    title: 'Home',
    route: '/',
  },
];

const notLoggedInMenuItems: TabSchema[] = [
  {
    title: 'Sign Up',
    route: '/signup',
    color: 'raspberry',
  },
  {
    title: 'Log In',
    route: '/login',
    color: 'purple',
  },
];

const loggedInMenuItems: TabSchema[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
  },
  {
    title: 'Groups',
    route: '/groups',
  },
];

export default function MenuBar() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const themeBorder = theme === 'light' ? lightBorder : darkBorder;
  const iconColor = theme === 'light' ? darkBackground : lightBackground;
  const [anchorElNav, setAnchorElNav] = useState(null);
  let menuItems = defaultMenuItems;
  if (isLoggedIn) {
    menuItems = defaultMenuItems.concat(loggedInMenuItems);
  } else {
    menuItems = defaultMenuItems.concat(notLoggedInMenuItems);
  }
  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const appBarContainerStyle: React.CSSProperties = { flex: 1, marginTop: 10, marginBottom: 10 };
  const rowGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'row' };
  const centerMenuItemStyle: React.CSSProperties = {
    width: '100%', display: 'flex', justifyContent: 'center',
  };

  return (
    <div style={appBarContainerStyle}>
      <Toolbar variant="dense">
        <Container maxWidth="xl">
          <Box sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between' }}>
            <IconButton
              edge="start"
              onMouseDown={() => {
                navigate('/');
              }}
            >
              <img alt="hourly logo" src={require('./logo512.png')} style={{ maxHeight: 50 }} />
            </IconButton>

            { menuItems.map((menuItem: TabSchema) => (
              <MenuItem
                key={`menuitem-${menuItem.title}`}
                onClick={() => {
                  navigate(menuItem.route);
                }}
              >
                <Title size="s" color={menuItem.color}>{menuItem.title}</Title>
              </MenuItem>
            ))}
            <div style={rowGroupStyle}>
              <MenuItem><ThemeButton /></MenuItem>
            </div>
          </Box>
          <IconButton
            size="large"
            aria-label="menu button"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            <MenuIcon style={centerMenuItemStyle} htmlColor={iconColor} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
            PaperProps={{
              sx: { backgroundColor: (theme === 'light' ? lightBackground : darkBackground), border: themeBorder },
            }}
          >
            {
              menuItems.map((menuItem: TabSchema) => (
                <MenuItem
                  key={`menuitem2-${menuItem.title}`}
                  style={centerMenuItemStyle}
                  onMouseDown={() => {
                    navigate(menuItem.route);
                  }}
                >
                  <Title color={menuItem.color} size="xs">{menuItem.title}</Title>
                </MenuItem>
              ))
            }
            <ThemeButton />
          </Menu>
        </Container>
      </Toolbar>
    </div>
  );
}
