// all react imports
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// all meterial ui component imports
import { Alert, Box, Button, InputAdornment, MenuItem, Snackbar, SnackbarCloseReason, TextField, Typography } from "@mui/material"

// all meterial ui date picker imports
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// all meterial ui icon imports
import AccountCircle from "@mui/icons-material/AccountCircle";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

// all style imports
import { buttonThemeSubmit, styledMultilineTextField, styledTextField, styledTitle, textfieldAdornmentStyle } from "../components/styles"
import { useNavigate } from "react-router";
import React from "react";

interface UserProfile {
    user_role: string;
}

function AdminCompetitionCreate() {
    // all consts below belong to the form. they are sorted by name
    const [competitionName, setCompetitionName] = useState("");
    const [game, setGame] = useState("");
    const [maxTeams, setMaxTeams] = useState('');
    const [gameType, setGameType] = useState("");
    const [description, setDescription] = useState("");
    const [competitionType, setCompetitionType] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = Cookies.get("token");

        if (!token) {
            setMessage("You must be logged in to create a competition.");
            setOpen(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/create-competition", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    competition_name: competitionName,
                    start_date: startDate,
                    end_date: endDate,
                    game,
                    max_teams: maxTeams,
                    game_type: gameType,
                    description,
                    competition_type: competitionType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create competition.");
            }

            const data = await response.json();
            setMessage(data.message || "Competition created successfully!");
            setMessageType("success");
            setOpen(true);
            navigate("/")
        } catch (error: any) {
            setMessage(error.message);
            setMessageType("error");
            setOpen(true);
            console.error("Error creating competition:", error);
        }
    };

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [_errorMessage, setErrorMessage] = useState<string>("");

    // Fetch user role
    useEffect(() => {
        const fetchProfile = async () => {
            const token = Cookies.get("token");

            if (!token) {
                setErrorMessage("You must be logged in to view your profile.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const result = await response.json();
                if (response.ok) {
                    setProfile(result.user);
                } else {
                    setErrorMessage(result.message || "Failed to fetch profile.");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setErrorMessage("Error connecting to the server.");
            }
        };

        fetchProfile();
    }, []);


    // a function that checks if the user is logged in and redirects the user to the home page if they are not.
    const token = Cookies.get('token')
    if (token != null) {
        console.log(token)
    } else {
        navigate('/')
    }
    useEffect(() => {
        const storedToken = Cookies.get("token");

        // Redirect if there's no token OR if the user is not an admin
        if (!storedToken || (profile && profile.user_role !== "admin")) {
            navigate('/');
        }
    }, [profile, navigate]);


    // these consts are for the snackbar
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

    // these consts set the options for the select fields
    const gameTypes = [
        { value: 'None', label: 'None' },
        { value: 'Shooters', label: 'Shooters' },
        { value: 'Platform fighters', label: 'Platform fighters' },
        { value: 'Speedrunning', label: 'Speedrunning' },
    ];

    const competitionTypes = [
        { value: 'None', label: 'None' },
        { value: 'Pvp', label: 'Pvp' },
        { value: 'Teams', label: 'Teams' },
        { value: 'Mega teams', label: 'Mega teams' },
    ];


    return (
        <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ bgcolor: "rgba(65, 70, 79, 1)", display: "flex", justifyContent: "center", width: '36vw', borderRadius: "0.5vw", border: "0.15vw solid black", }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* Competition bar */}
                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                    >

                        <Typography
                            variant="h4"
                            align="center"
                            sx={styledTitle}
                        >
                            Create a Competition
                        </Typography>

                        {/* Competition name textfield */}
                        <TextField
                            sx={styledTextField}
                            style={{ marginTop: "2vw" }}
                            required
                            id="CompetitionName"
                            label="Competition name"
                            value={competitionName}
                            onChange={(event) => { setCompetitionName(event.target.value); }}
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

                        {/* Competition discription multiline textfield */}
                        <TextField
                            sx={styledMultilineTextField}
                            required
                            id="CompetitionDiscription"
                            label="Competition discription"
                            value={description}
                            multiline
                            maxRows={6}
                            onChange={(event) => { setDescription(event.target.value); }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FormatAlignLeftIcon
                                                fontSize="inherit"
                                                sx={textfieldAdornmentStyle} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        {/* Game name textfield */}
                        <TextField
                            sx={styledTextField}
                            required
                            id="GameName"
                            label="Game name"
                            value={game}
                            onChange={(event) => { setGame(event.target.value); }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SportsEsportsIcon
                                                fontSize="inherit"
                                                sx={textfieldAdornmentStyle} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        {/* Game type select field */}
                        <TextField
                            sx={styledTextField}
                            id="GameType"
                            label="Select game type"
                            select
                            value={gameType}
                            defaultValue="None"
                            onChange={(event) => { setGameType(event.target.value); }}
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
                            {gameTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Competition type select field */}
                        <TextField
                            sx={styledTextField}
                            id="CompetitionType"
                            label="Select competition type"
                            select
                            value={competitionType}
                            defaultValue="None"
                            onChange={(event) => { setCompetitionType(event.target.value); }}
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
                            {competitionTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Participant ammount textfield */}
                        <TextField
                            sx={styledTextField}
                            required
                            id="ParticipantAmmount"
                            label="Participant ammount"
                            type="Number"
                            value={maxTeams}
                            onChange={(event) => { setMaxTeams(event.target.value); }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FormatListNumberedIcon
                                            fontSize="inherit"
                                            sx={textfieldAdornmentStyle}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* here are 2 datepickers that give the start date and end date.
                    both are build with the same componets but diffrent usedates and labels*/}
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                            <DateTimePicker
                                sx={styledTextField}
                                name="StartDate"
                                label="Start date"
                                //At the defaultValue the current date and time is set
                                defaultValue={dayjs()}
                                onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                            />

                            <DateTimePicker
                                sx={styledTextField}
                                name="EndDate"
                                label="End date"
                                defaultValue={dayjs()}
                                onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
                            />
                        </LocalizationProvider>

                        {/* submit button */}
                        <Button
                            variant="contained"
                            sx={buttonThemeSubmit}
                            style={{ marginBottom: "2vw" }}
                            type="submit"


                        >
                            <h2 style={{ fontSize: "1.5rem" }}>Create</h2>
                        </Button>

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
                    </form>
                </Box>
            </Box>
        </Box>
    )
}

export default AdminCompetitionCreate