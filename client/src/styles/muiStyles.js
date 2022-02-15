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