// all react imports
import React from 'react';
import { useEffect, useState } from 'react';

// all router imports
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'

// all material ui component imports
import {
    Box,
    InputAdornment,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    SnackbarCloseReason,
    MenuItem
} from "@mui/material";
import Grid from '@mui/material/Grid2';

// all material ui icons
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';

// all the components are imported from the components folder
import CompetitionBox from '../components/CompetitionBox';

// all the styles are imported from the styles file
import { borderText, buttonThemeBlue, centeredGridText, defaultBarStyled, fixedFilterPosition, styledSelectFieldSmall, textfieldAdornmentStyle } from '../components/styles';

// this interface is used to give the user profile its needed information/data
interface UserProfile {
    user_role: string;
}

// this interface is used to give the competitionBox object its needed information/data
interface Competition {
    competition_id: number;
    name: string;
    game: string;
    game_type: string;
    start_date: string;
    end_date: string;
    joined_teams: number;
    max_teams: number;
    is_joined: number;
}

function Competitions() {
    // these 2 consts are made for the filter fields, they are used to give the user some options to filter the competitions
    const filterGeneral = [
        { value: 'None', label: 'None' },
        { value: 'Date', label: 'Date' },
        { value: 'Game type', label: 'Game type' },
        { value: 'Avalable', label: 'Avalable' },
    ];

    const filterTeams = [
        { value: 'None', label: 'None' },
        { value: 'Pvp', label: 'Pvp' },
        { value: 'Teams', label: 'Teams' },
        { value: 'Mega Teams', label: 'Mega Teams' },
    ];

    // these 2 consts are used to store the value of the filter
    const [generalFilter, setGeneralFilter] = useState('');
    const [teamsFilter, setTeamsFilter] = useState('');

    // these consts are used for setting the competitions/displaying them and the messages that are displayed to the user
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [message, setMessage] = useState<string>("");
    const [messageType, setMessageType] = useState('');

    // Fetch competitions
    const fetchCompetitions = async () => {
        const token = Cookies.get("token");

        if (!token) {
            setMessage("You must be logged in to view competitions.");
            setMessageType("error");
            setOpen(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/competitions", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setCompetitions(data.competitions || []);
                console.log(data.competitions)
            } else {
                setMessage(data.message || "Failed to fetch competitions.");
                setMessageType("error");
                setOpen(true);
            }
        } catch (error) {
            console.error("Error fetching competitions:", error);
            setMessage("An error occurred while fetching competitions.");
            setMessageType("error");
            setOpen(true);
        }
    };

    // Join a competition
    const joinCompetition = async (competitionId: number) => {
        const token = Cookies.get("token");

        if (!token) {
            setMessage("You must be logged in to join a competition.");
            setMessageType("error");
            setOpen(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/join-competition", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ competitionId }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || "Successfully joined the competition!");
                setMessageType("success");
                setOpen(true);
                // Update the competition list
                fetchCompetitions();
            } else {
                setMessage(data.message || "Failed to join competition.");
                setMessageType("error");
                setOpen(true);
            }
        } catch (error) {
            console.error("Error joining competition:", error);
            setMessage("An error occurred while joining the competition.");
            setMessageType("error");
            setOpen(true);
        }
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const [loggedInUserRole, setLoggedInUserRole] = useState<string>("");
    const [_errorMessage, setErrorMessage] = useState<string>("");

    // Helper to check the token
    const getToken = () => {
        const token = Cookies.get("token");
        if (!token) {
            setErrorMessage("You must be logged in to perform this action.");
        }
        return token;
    };

    // Fetch user team role
    const fetchTeamUserRole = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/team-members", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                setLoggedInUserRole(data.loggedInUserRole || "");
                setMessage("");
            } else {
                setMessage(data.message || "Failed to fetch team details.");
            }
        } catch (error) {
            console.error("Error fetching team details:", error);
            setMessage("Error connecting to the server.");
        }
    };

    useEffect(() => {
        fetchTeamUserRole();
    });

    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Fetch user role to check for admin
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
    const navigate = useNavigate();
    const [, setRedirect] = useState(false);

    const token = Cookies.get('token')
    if (token != null) {
        console.log(token)
    } else {
        navigate('/')
    }
    useEffect(() => {
        const storedToken = Cookies.get("token");
        if (!storedToken) {
            setRedirect(true);
            return;
        }
    }, []);

    // Snackbar functions
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
        // this is the main grid that holds all the competitions and the filter box
        <Grid container size={12} sx={centeredGridText}>

            {/* the page title grid */}
            <Grid size={6}>
                <Grid container size={12}>
                    <Typography
                        variant='h4'
                        sx={borderText}
                        style={{ color: "rgba(74, 182, 236, 1)", marginRight: "0.5vw" }}>
                        All
                    </Typography>

                    <Typography
                        variant='h4'
                        sx={borderText}
                        style={{ color: "white" }}>
                        Competitions
                    </Typography>

                    <Box sx={defaultBarStyled} style={{ width: "59%", marginTop: "2vh", marginLeft: "1vw", marginRight: "1vw" }}> </Box>
                </Grid>

                {/* Competitions */}
                <Grid container size={12} style={{ marginTop: "2vh" }}>
                    {competitions.map((competition) => (
                        <CompetitionBox
                            key={competition.competition_id} // Gives the component a unique key/id
                            Link={() => navigate(`/CompetitionInfo/${competition.competition_id}`)} // Redirects to the competition info page by giving it the right id of the competition
                            Color="rgba(42, 79, 77, 1)" // Controls the color of the image/box
                            Name={competition.name} // Gives the name of the competition
                            StartDate={new Date(competition.start_date).toLocaleDateString()}
                            EndDate={new Date(competition.end_date).toLocaleDateString()}
                            GameType={competition.game_type}
                            JoinedTeams={competition.joined_teams} // Gives the component the number of teams joined so it can be compaired with max teams
                            MaxTeams={competition.max_teams}
                            IsJoined={competition.is_joined} // Checks if the user is joined in the competition already
                            UserRole={loggedInUserRole} // Gives the user role to the component so it can be checked if the user is a team leader/admin or not
                            Clicked={() => joinCompetition(competition.competition_id)} /> // Function that is called when the button is clicked and the competition isnt full or joined already
                    ))}
                </Grid>
            </Grid>

            {/* here is the  filter Box/Grid that scrolles with the page*/}
            <Grid container size={2}>
                <Box style={{ display: "flex", flexDirection: "column" }} sx={fixedFilterPosition}>
                    <Typography variant='h4'
                        sx={borderText}
                        style={{ color: "white", marginBottom: "0.5vw", marginLeft: "0.5vw" }}>
                        Filter by
                    </Typography>

                    {/* this textfield is going to be used as the general filter, giving some brod options */}
                    <TextField
                        sx={styledSelectFieldSmall}
                        style={{ width: "15vw" }}
                        id="FilterGeneral"
                        label="General filter"
                        select
                        value={generalFilter}
                        defaultValue="None"
                        onChange={(event) => { setGeneralFilter(event.target.value); }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Filter1Icon
                                        fontSize="inherit"
                                        sx={textfieldAdornmentStyle}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    >
                        {filterGeneral.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* This textfield is going to be the filter that seaches for competitions that are team based, pvp or massive competitions*/}
                    <TextField
                        sx={styledSelectFieldSmall}
                        style={{ width: "15vw" }}
                        id="FilterTeams"
                        label="Teams filter"
                        select
                        value={teamsFilter}
                        defaultValue="None"
                        onChange={(event) => { setTeamsFilter(event.target.value); }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Filter2Icon
                                        fontSize="inherit"
                                        sx={textfieldAdornmentStyle}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    >
                        {filterTeams.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        variant="contained"
                        sx={buttonThemeBlue}
                        style={{ width: "15vw", margin: "0.5vw", marginTop: "2vw" }}
                        type="submit">
                        Search
                    </Button>

                    {/* This button is only visible for admin users and will bring the user to the create competition page*/}
                    {profile?.user_role === "admin" && (
                        <Link to="/CompetitionCreate">
                            <Button
                                variant="contained"
                                sx={buttonThemeBlue}
                                style={{ width: "15vw", margin: "0.5vw" }}>
                                Create competition
                            </Button>
                        </Link>
                    )}
                </Box>

                {/* this snackbar only opens if a message needs to be displayed to the user */}
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
            </Grid>
        </Grid >
    )
}

export default Competitions