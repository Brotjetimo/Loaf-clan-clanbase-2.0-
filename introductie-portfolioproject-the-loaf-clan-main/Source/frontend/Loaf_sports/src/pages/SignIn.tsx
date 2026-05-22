// all react imports
import React, { useEffect } from "react";
import { useState } from "react";

// all imports used for the cookies
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

// all meterial ui components used for the forum
import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from "@mui/material"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// all meterial icons used
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

// every inport used in the alert
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// all style components used
import { buttonThemeSubmit, styledTextField, styledTitle, defaultBarStyled, textfieldAdornmentStyle } from "../components/styles";

function SignIn() {

    // a function that checks if the user is logged in and redirects the user to the home page if so.
    const navigate = useNavigate();
    const [, setRedirect] = useState(false);

    const token = Cookies.get('token')
    if (token != null) {
        console.log(token)
        navigate("/")
    }

    useEffect(() => {
        if (token) {
            setRedirect(true);
            return;
        }
    }, []);

    // functions used for the showing and not showing of the password field inputs
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // every function used for the forum
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const loginData = {
            username,
            password
        };

        // tries to send the used login data to the database to check if its correct
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok) {
                // the login is succesfull, sets a cookie that expires in 3 days and sends the user to the homepage
                // (if the user for some reason gets stuck on this page a success masage appears telling the user that he is logged in)
                Cookies.set('token', result.token, { expires: 3 });
                navigate('/');
                window.location.reload();
                setErrorMessage('');
                setMessageType('success');
                setOpen(true);
            } else {
                // if the login is false the user will get an alert telling what error happend
                setErrorMessage(result.message || 'Login failed');
                setMessageType('error');
                setOpen(true);
            }
        } catch (error) {
            setErrorMessage('Error connecting to the server');
            setMessageType('error');
            setOpen(true);
        } finally {
            setLoading(false); // Set loading to false after request is complete
        }
    };

    // functions used for the opening and closing of the alert
    const [open, setOpen] = React.useState(false);
    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    return (
        <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>

            <Box sx={{ bgcolor: "rgba(65, 70, 79, 1)", display: "flex", justifyContent: "center", width: '36vw', borderRadius: "0.5vw", border: "0.15vw solid black", }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* login bar */}
                    <Typography
                        variant="h4"
                        align="center"
                        sx={styledTitle}
                    >
                        Login
                    </Typography>

                    {/* Account logo */}
                    <AccountCircleIcon fontSize="inherit" style={{ width: "25vw", fontSize: "15vw", marginTop: "2vw" }} />

                    {/* Username/Email text field */}
                    <TextField
                        sx={styledTextField}
                        required
                        id="Username"
                        label="Username/Email"
                        value={username}
                        onChange={(event) => { setUsername(event.target.value); }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle
                                            fontSize="inherit"
                                            sx={textfieldAdornmentStyle} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* Password text field */}
                    <FormControl
                        sx={styledTextField}
                        variant="outlined"
                        required
                    >
                        <InputLabel htmlFor="toggle password visibility">Password</InputLabel>
                        <OutlinedInput
                            id="toggle password visibility"
                            type={showPassword ? 'text' : 'password'}
                            startAdornment={
                                <InputAdornment position="start">
                                    <LockOpenIcon
                                        fontSize="inherit"
                                        sx={textfieldAdornmentStyle}
                                    />
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        type="button"
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            value={password}
                            onChange={(event) => { setPassword(event.target.value); }}
                            label="toggle password visibility"
                        />
                    </FormControl>

                    {/* Forgot your password link */}
                    <Typography variant="body1"
                        style={{ color: "rgba(74, 182, 236, 1)", marginBottom: "0.5vw" }}>
                        Forgot your password?
                    </Typography>

                    {/* Login submit button */}
                    <Button
                        variant="contained"
                        sx={buttonThemeSubmit}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        <h2 style={{ fontSize: "1.5rem", color: "white" }}>
                            {loading ? 'Logging in...' : 'Login'}
                        </h2>
                    </Button>


                    <Box sx={defaultBarStyled} style={{ width: "25vw" }}> </Box>

                    {/* create account link */}
                    <Link to="/SignUp">
                        <Button
                            variant="contained"
                            sx={buttonThemeSubmit}
                            style={{ marginBottom: "2vw" }}
                        >
                            <h2 style={{ fontSize: "1.5rem" }}>Register</h2>
                        </Button>
                    </Link>

                    {/* alert that shows up after pressing the submit button */}
                    {errorMessage && <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert
                            onClose={handleClose}
                            severity={messageType !== "error" && messageType !== '' ? "success" : "error"}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {errorMessage}
                        </Alert>
                    </Snackbar>}
                </Box>
            </Box >
        </Box >
    )
};

export default SignIn