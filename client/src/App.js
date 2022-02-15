import NavBar from './components/NavBar'
import React from 'react'
import {Paper, ThemeProvider } from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'
import { useMainPaperStyles } from './styles/muiStyles'
import AuthForm from './components/AuthForm';

const App = () => {
  const classes = useMainPaperStyles()
  const customTheme = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#FF5700'
      },
      secondary: {
        main: '#00b300'
      }
    }
  })

  return (
    <ThemeProvider theme={customTheme}>
      <Paper className={classes.root} elevation={0}>
        <NavBar />
      </Paper>
    </ThemeProvider>  
   
   
    )
}

export default App;
