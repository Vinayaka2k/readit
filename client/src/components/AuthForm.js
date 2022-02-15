import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {useDispatch} from 'react-redux'
import {Formik, Form} from 'formik'
import * as yup from 'yup'
import {TextInput} from './FormikMuiFields'

import {Button, Typography, Divider} from '@material-ui/core'
import {useAuthStyles} from '../styles/muiStyles'
import PersonIcon from '@material-ui/icons/Person'
import LockIcon from '@material-ui/icons/Lock'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import PersonAddIcon from '@material-ui/icons/PersonAdd'

const validationSchemaSignup = yup.object({
    username : yup.string()
        .required()
        .max(20, 'Must be at most 20 characters')
        .min(3, 'Must be atleast 3 characters')
        .matches(/^[a-zA-Z0-9]$/, 'Only alpha-numeric characters allowed'),

    password: yup.string()
        .required()
        .min(6, 'Must be atleast six characters')
})
const validationSchemaLogin = yup.object({
    username: yup.string().required(),
    password: yup.string().required()
})

const AuthForm = () => {
    const [authType, setAuthType] = useState('login')

    const handleLogin = () => {

    }
    const handleSignup = () => {

    }
    const classes = useAuthStyles(authType)()
    return (
        <div className={classes.authWrapper}>
            <Formik 
                validateOnChange={true} 
                initialValues={{username:'', password:''}}
                onSubmit={authType === 'login' ? handleLogin : handleSignup} 
            >
                <Form className={classes.form}>
                    <Typography 
                        variant="h4" 
                        color="secondary" 
                        className={classes.formTitle}
                    >
                        {authType === 'login' ? 'Login to your Account' : 'Create a new Account'}
                    </Typography>
                    <div className={classes.input}>
                        <PersonIcon className={classes.inputIcon} color="secondary"/>
                        <TextInput 
                            name="username" 
                            type="text" 
                            placeholder="Enter Username"
                            label="Username"
                            required
                            fullWidth
                            />
                    </div>
                    <div className={classes.input}>
                        <LockIcon className={classes.inputIcon} color="secondary"/>
                        <TextInput 
                            name="password" 
                            type="password" 
                            placeholder="Enter Password"
                            label="Password"
                            required
                            fullWidth
                            />
                    </div>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        size="large"
                        startIcon = {
                            authType === 'login' ? <ExitToAppIcon /> : <PersonAddIcon />
                        }
                        className={classes.submitButton}
                    >
                        {authType === "login" ? 'Login' : 'SignUp'}
                    </Button>
                </Form>
            </Formik>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <div className={classes.sidePanel}>
                <Typography variant="h6" className={classes.switchText} color="primary">
                        {authType === 'login' 
                        ? 'Dont have an Account?'
                        : 'Already have an Account?'}
                </Typography>
                <Button onClick= {() => authType === 'login' ? setAuthType('signup') : setAuthType('login')}
                    fullWidth
                    size="large"
                    color="primary"
                    variant="outlined"
                    startIcon = {
                        authType === 'login' ? <PersonAddIcon/> : <ExitToAppIcon/>
                    }
                >
                    {authType === 'login' ? 'SignUp' : 'Login'}
                </Button>
            </div>
        </div>
    )
}

export default AuthForm