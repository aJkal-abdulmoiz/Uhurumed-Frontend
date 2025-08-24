// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2:{
      color:'#000',
      fontSize:'27px',
      fontWeight:'600',
      lineHeight:'30px',
    },
    h3:{
      color:'#000',
      fontSize:'35px',
      fontWeight:'600',
      lineHeight:'50px',
      '@media (max-width: 600px)': {
        fontSize: '22px',
        lineHeight: '30px',
      },
    },
    h4:{
      color:'#0077CC',
        
    },
    h5:{
      color:'#0077CC',
        
    },
    h9: {
      fontSize: '70px',
      lineHeight: '80px',
      '@media (max-width:600px)': {
        fontSize: '38px',
        lineHeight: '48px',
      
      },
    },
    
    body1:{
      color:'#000',
      fontSize:'20px',
      fontWeight:'500',
    },
    body2:{
      color:'#000',
      fontSize:'14px',
      fontWeight:'500',
    },
    body3:{
      color:'#000',
      fontSize:'18px',
      fontWeight:'500',
      fontFamily:'roboto',
      marginTop:'10px',
    },
    body4:{
      color:'#0077CC'
    }
  },
  components: {

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          height: '20px',
        },
        shrink: {
          fontSize: '15px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '12px',
          padding: '14px 12px',
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        outlined: {
          backgroundColor: '#000', // Add background to outlined button
          borderColor: '#1976d2',
          color: '#1976d2',
          '&:hover': {
            backgroundColor: '#e0e0e0',
            borderColor: '#115293',
          },
        },
        primary:{
          background:'green',
          color:'#fff'
        },
      },
    },
  },
});

export default theme;
