// all react components
import React, { useEffect } from "react";
import { useState } from "react";

// all cookie imports
import Cookies from 'js-cookie';

// all meterial ui components used for the forum
import {
    Alert,
    Box,
    Button,
    Checkbox,
    InputAdornment,
    Snackbar,
    SnackbarCloseReason,
    TextField,
    Typography,
} from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

// all icon imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';

// all style components
import { buttonThemeSubmit, multiselectTextStyle, styledTextField, styledTitle, textfieldAdornmentStyle } from "../components/styles";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";

interface User {
    id: string;
    username: string;
}

// styling for multiple select menu
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            Width: 250,
        },
    },
};

export default function TeamsCreate() {
    const navigate = useNavigate();

    // all forem functions
    const [teamName, setTeamName] = useState('');
    const [loading, setLoading] = useState(false); // Loader state
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState('');

    const [users, setUsers] = useState<User[]>([]); // Available users
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]); // Selected user IDs
    const [_errorMessage, setErrorMessage] = useState("");
    const [_successMessage, setSuccessMessage] = useState("");


    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = Cookies.get("token");
        if (!token) {
            setMessage("You must be logged in to create a team.");
            setMessageType("error");
            setOpen(true);
            return;
        }

        if (!teamName.trim()) {
            setMessage("Team name cannot be empty.");
            setMessageType("error");
            setOpen(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/create-team", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamName, invitedUsers: selectedUserIds }), // Include selected user IDs
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(result.message || "Team created successfully.");
                setMessageType("success");
                setOpen(true);
                setTeamName("");
                setSelectedUserIds([]); // Clear selected users
                setLoading(false);
                navigate("/account");
                sendInvites();
            } else {
                setMessage(result.message || "Failed to create team.");
                setMessageType("error");
                setOpen(true);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error connecting to the server:", error);
            setMessage("Error connecting to the server");
            setMessageType("error");
            setOpen(true);
            setLoading(false);
        }
    };

    // Fetch available users
    const fetchUsers = async () => {
        const token = Cookies.get("token");
        if (!token) {
            setErrorMessage("You must be logged in to see available users.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/available-users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setUsers(data.users); // Update the users list
            } else {
                setErrorMessage(data.message || "Failed to fetch users.");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setErrorMessage("Error connecting to the server.");
        }
    };

    // Send invites to selected users
    const sendInvites = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        const token = Cookies.get("token");
        if (!token) {
            setErrorMessage("You must be logged in to send invites.");
            return;
        }

        if (selectedUserIds.length === 0) {
            setErrorMessage("Please select at least one user to invite.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/send-invite", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ targetUserIds: selectedUserIds }), // Send selected user IDs
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message || "Invites sent successfully.");
                setSelectedUserIds([]); // Clear selections after successful invite
            } else {
                setErrorMessage(data.message || "Failed to send invites.");
            }
        } catch (error) {
            console.error("Error sending invites:", error);
            setErrorMessage("Error connecting to the server.");
        }
    }

    // all the functions used for the multiselect field
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

    useEffect(() => {
        fetchUsers();
    }, []);

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
                        Create team
                    </Typography>

                    <AccountCircleIcon
                        fontSize="inherit"
                        sx={{ width: "25vw", fontSize: "15vw", marginTop: "2vw" }}
                    />

                    <form onSubmit={handleCreateTeam} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            sx={styledTextField}
                            required
                            id="Team-name"
                            label="Team name"
                            value={teamName}
                            onChange={(event) => { setTeamName(event.target.value); }}
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

                        <FormControl sx={styledTextField}>
                            <InputLabel id="demo-multiple-chip-label">Invite users</InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={selectedUserIds} // Track selected user IDs
                                onChange={(event) => {
                                    const {
                                        target: { value },
                                    } = event;
                                    setSelectedUserIds(
                                        typeof value === 'string' ? value.split(',') : value
                                    );
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AddIcon fontSize="inherit" sx={textfieldAdornmentStyle} />
                                    </InputAdornment>
                                }
                                input={<OutlinedInput id="select-multiple-chip" label="Invite users" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((id) => {
                                            const user = users.find((user) => user.id === id);
                                            return user ? (
                                                <Chip
                                                    key={id}
                                                    label={user.username}
                                                    sx={multiselectTextStyle}
                                                />
                                            ) : null;
                                        })}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {users.map((user) => (
                                    <MenuItem
                                        key={user.id}
                                        value={user.id}
                                    >
                                        <Checkbox checked={selectedUserIds.includes(user.id)} />
                                        {user.username}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            sx={buttonThemeSubmit}
                            style={{ marginBottom: "2vw" }}
                            type="submit"
                            disabled={loading}
                        >
                            <h2 style={{ fontSize: "1.5rem", color: "white" }}>
                                {loading ? 'Creating team...' : 'Create team'}
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
    )
}