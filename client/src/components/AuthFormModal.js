import React, {useState} from 'react'
import AuthForm from './AuthForm'

import {Dialog, DialogContent, Button} from '@material-ui/core'
import { useNavStyles } from '../styles/muiStyles'

const AuthFormModal = () => {
    const [open, setOpen] = useState(false)
    const classes = useNavStyles()
    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <div>
            <Button
            onClick={handleClickOpen}
            color="primary"
            className={classes.navButtons}>
                Login/Register
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogContent>
                    <AuthForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AuthFormModal