import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useSplashContext } from '../store/SplashContext';

const pages = ['Projects'];
const settings = ['Logout'];

const Header = () => {
  const { isAuthenticated, login, logout, close, currentProject } = useSplashContext();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getTitle = () => {
    if (currentProject) {
      return `SAVE ${currentProject.id} AND EXIT`
    } else {
      return "PROJECTS"
    }
  }

  return (
    <AppBar position="static" style={{ backgroundColor: "dimgray" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SPLASH
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <Button
                key={getTitle()}
                onClick={close}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {getTitle()}
              </Button>
              {/* {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))} */}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SPLASH
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
             <Button
                key={getTitle()}
                onClick={close}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {getTitle()}
              </Button>
            {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))} */}
          </Box>

        {isAuthenticated ?
          <MenuItem key={"Logout"} onClick={logout}>
            <Typography textAlign="center">{"Logout"}</Typography>
          </MenuItem>
          // <Box sx={{ flexGrow: 0 }}>
          //   <Tooltip title="Open settings">
          //     <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          //       <Avatar alt="S" />
          //     </IconButton>
          //   </Tooltip>
          //   <Menu
          //     sx={{ mt: '45px' }}
          //     id="menu-appbar"
          //     anchorEl={anchorElUser}
          //     anchorOrigin={{
          //       vertical: 'top',
          //       horizontal: 'right',
          //     }}
          //     keepMounted
          //     transformOrigin={{
          //       vertical: 'top',
          //       horizontal: 'right',
          //     }}
          //     open={Boolean(anchorElUser)}
          //     onClose={handleCloseUserMenu}
          //   >
          //     {settings.map((setting) => (
          //       <MenuItem key={setting} onClick={handleCloseUserMenu}>
          //         <Typography textAlign="center">{setting}</Typography>
          //       </MenuItem>
          //     ))}
          //   </Menu>
          // </Box>
          : 
          <MenuItem key={"Login"} onClick={login}>
            <Typography textAlign="center">{"Login"}</Typography>
          </MenuItem>
        }   
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
