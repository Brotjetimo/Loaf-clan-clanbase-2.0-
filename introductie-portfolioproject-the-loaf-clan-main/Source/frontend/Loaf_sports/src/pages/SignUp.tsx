// all react imports
import React, { useState } from "react";

// all meterial ui components used for the forum
import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    SnackbarCloseReason,
    MenuItem
} from "@mui/material";

// all icon imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TodayIcon from '@mui/icons-material/Today';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

// all style components
import { buttonThemeSubmit, styledTextField, styledTitle, textfieldAdornmentStyle } from "../components/styles";

function SignUp() {

    const games = [
        { value: 'None', label: 'None' },
        { value: 'Shooters', label: 'Shooters' },
        { value: 'Platform fighters', label: 'Platform fighters' },
        { value: 'Speedrunning', label: 'Speedrunning' },
    ];

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show)
    };

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newAge, setNewAge] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newGamePreference, setNewGamePreference] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false); // Loader state

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Simple client-side validation for empty fields
        if (!newUsername || !newPassword || !newAge || !newEmail || !newGamePreference) {
            setMessage("All fields are required.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newUsername,
                    password: newPassword,
                    newAge: parseInt(newAge), // Convert age to number
                    newEmail,
                    newGamePreference,
                }),
            });

            const data = await response.json();
            if (response.status === 201) {
                setMessage('User registered successfully!');
                setMessageType('success');
                setOpen(true);
            } else {
                setMessage(data.message || 'Registration failed.');
                setMessageType('error');
                setOpen(true);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('An error occurred. Please try again.');
            setMessageType('error');
            setOpen(true);
        } finally {
            setLoading(false); // Set loading to false after request is complete
        }
    };

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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >

            <Box
                sx={{
                    bgcolor: "rgba(65, 70, 79, 1)",
                    display: "flex",
                    justifyContent: "center",
                    width: '36vw',
                    borderRadius: "0.5vw",
                    border: "0.15vw solid black",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                    }}
                >

                    <Typography
                        variant="h4"
                        align="center"
                        sx={styledTitle}
                    >
                        Sign Up
                    </Typography>

                    <AccountCircleIcon
                        fontSize="inherit"
                        sx={{ width: "25vw", fontSize: "15vw", marginTop: "2vw" }}
                    />

                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            sx={styledTextField}
                            required
                            id="Username"
                            label="Username"
                            value={newUsername}
                            onChange={(event) => { setNewUsername(event.target.value); }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle
                                            fontSize="inherit"
                                            sx={textfieldAdornmentStyle}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            sx={styledTextField}
                            required
                            id="Email"
                            label="Email-adress"
                            type="Email"
                            value={newEmail}
                            onChange={(event) => { setNewEmail(event.target.value); }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmailIcon
                                            fontSize="inherit"
                                            sx={textfieldAdornmentStyle}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />

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
                                value={newPassword}
                                onChange={(event) => { setNewPassword(event.target.value); }}
                                label="toggle password visibility"
                            />
                        </FormControl>

                        <TextField
                            sx={styledTextField}
                            required
                            id="Age"
                            label="Age"
                            type="Number"
                            value={newAge}
                            onChange={(event) => { setNewAge(event.target.value); }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TodayIcon
                                            fontSize="inherit"
                                            sx={textfieldAdornmentStyle}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            sx={styledTextField}
                            id="GamePreverance"
                            label="GamePreverance"
                            select
                            value={newGamePreference}
                            defaultValue="None"
                            onChange={(event) => { setNewGamePreference(event.target.value); }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SportsEsportsIcon
                                            fontSize="inherit"
                                            sx={textfieldAdornmentStyle}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            {games.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            variant="contained"
                            sx={buttonThemeSubmit}
                            style={{ marginBottom: "2vw" }}
                            type="submit"
                            disabled={loading}
                        >
                            <h2 style={{ fontSize: "1.5rem", color: "white" }}>
                                {loading ? 'Creating account...' : 'Create account'}
                            </h2>
                        </Button>
                    </form>

                    {message && <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert
                            onClose={handleClose}
                            severity={messageType !== "error" && messageType !== '' ? "success" : "error"}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {message}
                        </Alert>
                    </Snackbar>}
                </Box>
            </Box>
        </Box>
    );
}

export default SignUp;