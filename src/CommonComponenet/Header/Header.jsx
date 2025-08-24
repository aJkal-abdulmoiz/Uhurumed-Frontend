import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Btn from '../CommonButtons/Btn';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Auth';
import {NavLink} from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function Header() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userLoggedIn, userData } = useContext(AuthContext);
  const { user } = useAuthStore.getState();
  // Assuming you provide this from context

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (userLoggedIn) {
      switch (user.userType) {
      case 'ADMIN':
        navigate('/dashboard');
        break;
      case 'DOCTOR':
        navigate('/doctor-dashboard');
        break;
      case 'USER':
        navigate('/user-dashboard');
        break;
      default:
        navigate('/dashboard'); // fallback route
        break;
      }
    } else {
      navigate('/login');
    }
  };

  const handleSignUp = () => {
    navigate('/signUp');
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      {/* <List style={{ paddingTop: "100px" }}>
        {["Home", "About", "Specialist", "Contact Us", "Login", "Sign Up"].map(
          (text) => (
            <ListItem button key={text} onClick={() => handleNavigation(text)}>
              <ListItemText
                primary={text}
                primaryTypographyProps={{ style: { color: "#0077CC" } }}
              />
            </ListItem>
          )
        )}
      </List> */}
      <List style={{ paddingTop: '100px' }}>
        {['Specialist', 'How it Works', 'Login',]
          .filter((text) => {
            // 🔒 Hide "Sign Up" if user is logged in
            if (userLoggedIn && text === 'Sign Up') return false;

            return true;
          })
          .map((text) => {
            // 🔁 Replace "Login" with "Dashboard" if user is logged in
            const displayText =
              userLoggedIn && text === 'Login' ? 'Dashboard' : text;

            return (
              <ListItem
                button
                key={displayText}
                onClick={() =>
                  handleNavigation(
                    displayText === 'Dashboard' ? 'Dashboard' : text
                  )
                }
              >
                <ListItemText
                  primary={displayText}
                  primaryTypographyProps={{ style: { color: '#0077CC' } }}
                />
              </ListItem>
            );
          })}
      </List>
    </Box>
  );

  const handleHome = () => {
    navigate('/');
  };

  const handleNavigation = (text) => {
    switch (text) {
    // case "Home":
    //   navigate("/");
    //   break;
    // case "About":
    //   navigate("/about");
    //   break;
    case 'Specialist':
      navigate('/specialist');
      break;
      // case "Proposition":
      //   navigate("/proposition");
      //   break;
    case 'How it Works':
      navigate('/work');
      break;
      // case "Contact Us":
      //   navigate("/contact");
      //   break;
    case 'Login':
      navigate('/login');
      break;
      // case "Sign Up":
      //   navigate("/signup");
      //   break;
    case 'Dashboard':
      navigate('/dashboard');
      break;
    default:
      break;
    }
  };

  // const handleNavigation = (text) => {
  //   switch (text) {
  //     case "Home":
  //       navigate("/");
  //       break;
  //     case "About":
  //       navigate("/about");
  //       break;
  //     case "Specialist":
  //       navigate("/expert");
  //       break;
  //     case "Contact Us":
  //       navigate("/contact");
  //       break;
  //     default:
  //       break;
  //   }
  // };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: 'teal',
          padding: '8px 0', // padding only top/bottom
          width: '100%',
          top: 0,
          left: 0,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* <Box onClick={handleHome} style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="Images/uhuruMedLogoSVG.svg"
                alt="logo"
                style={{ height: 35, marginRight: 4, cursor: 'pointer', }}

              />
              <h1  className='text-[25px] text-[#04A4DF] cursor-pointer font-[600]'>
              UhuruMed
              </h1>
            </Box> */}
            <NavLink to="/" className="flex items-center">
              <img src="/images/uhuruMedHDLogo.jpeg" alt="UhuruMed Logo" width={80} height={80} />
              <h1  className='pl-1 text-[32px] text-black cursor-pointer font-[600]'>
                          UhuruMed
              </h1>
            </NavLink>

            {isMobile ? (
              <IconButton edge="end" onClick={toggleDrawer(true)}>
                <MenuIcon sx={{ color: '#0077CC' }} />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={3} alignItems="center">
                {['Specialist', 'How it Works'].map((text) => (
                  <Typography
                    key={text}
                    variant="body1"
                    onClick={() => handleNavigation(text)}
                    sx={{
                      cursor: 'pointer',
                      color: '#000',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    {text}
                  </Typography>
                ))}
                <Btn
                  label={userLoggedIn ? 'Dashboard' : 'Login'}
                  onClick={handleLogin}
                  backgroundColor={'#2e5ad5'}
                />
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
}
