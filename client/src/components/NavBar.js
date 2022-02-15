import React, {useState} from 'react'
import AuthFormModal from './AuthFormModal';

import {
    AppBar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    Link
} from '@material-ui/core'

import Toolbar from '@material-ui/core/Toolbar'
import RedditIcon from '@material-ui/icons/Reddit'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useNavStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';

const NavBar = () => {
    const classes = useNavStyles()
    const desktopMenu = () => {
        return (
          
                 <AuthFormModal />
           
        )
    }

    return (
        <div className={classes.main}>
            <AppBar position="static" color="inherit">
                <Toolbar>
                    <div className={classes.topLeftButton}>
                        <div className={classes.logoWrapper}>
                            <Typography variant="h6" color="primary" className={classes.logo}>
                                <RedditIcon color="primary" className={classes.logoIcon}/>
                                    ReadIt
                            </Typography>
                            <Typography variant="caption" color="secondary">
                                Made with <FavoriteIcon style={{fontSize:12}}/> by <Link
                                href={"#"} color="inherit" target="_blank" rel="noopener">
                                <strong>{'Vinayaka2k'}</strong>
                                </Link>
                            </Typography>
                        </div>
                    </div>
                    {desktopMenu()}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar