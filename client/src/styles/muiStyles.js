import { capitalize } from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

export const useMainPaperStyles = makeStyles(() => ({
    root:{
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: '100vh'
    }
}))

export const useNavStyles = makeStyles(theme => ({
    main: {
        flexGrow: 1
    },
    topLeftButton: {
        flexGrow: 1
    },
    logoWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    logo: {
        display: 'flex',
        alignItems: 'center'
    },
    logoIcon: {
        marginRight: 5
    },
    titleButton: {
        textTransform: 'capitalize',
        fontSize: 20,
        marginRight: 12
    },
    navButtons: {
        '&:hover': {
            backgroundColor: '#ffe5d8'
        }
    }
}))

export const useAuthStyles = (authType) =>
  makeStyles((theme) => ({
    authWrapper: {
      display: 'flex',
      flexDirection: authType === 'login' ? 'row' : 'row-reverse',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 20
    },
    formTitle: { textAlign: 'center' },
    switchText: { textAlign: 'center' },
    submitButton: {
      marginTop: '1em',
    },
    input: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    inputIcon: {
      marginRight: 8,
    },
    sidePanel: {
      padding: 20,
      margin: 'auto 0',
    },
  }));