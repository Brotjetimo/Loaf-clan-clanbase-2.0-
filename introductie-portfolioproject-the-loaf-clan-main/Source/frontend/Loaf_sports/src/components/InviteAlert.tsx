// all react compoents
import React from "react";
import { useEffect, useState } from "react";

// all cookie imports
import Cookies from "js-cookie";

// all default material ui imports
import {
    Alert,
    Box, Button,
    ButtonGroup,
    Checkbox,
    Chip,
    DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Snackbar,
    SnackbarCloseReason,
} from "@mui/material";

// all material ui diolog imports
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// all material ui icon imports
import AddIcon from '@mui/icons-material/Add';

// all the styles for the components
import { multiselectTextStyle, styledTextField, textfieldAdornmentStyle } from "./styles";

// interface used for the props
interface CLicked {
    Question: string;
    Close: () => void | Promise<void>;
}

// interface used for getting the users
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

// changes the styling of the names for the selections

export default function AreSureAlert(props: CLicked) {

    // all forem functions
    const [users, setUsers] = useState<User[]>([]); // Available users
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]); // Selected user IDs
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState('');

    const [_errorMessage, setErrorMessage] = useState("");
    const [_successMessage, setSuccessMessage] = useState("");

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
    const sendInvites = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const token = Cookies.get("token");
        if (!token) {
            setErrorMessage("You must be logged in to send invites.");
            return;
        }

        if (selectedUserIds.length === 0) {
            setMessage("Please select at least one user to invite.");
            setMessageType("error");
            setOpen(true);
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
                setMessage(data.message || "Invites sent successfully.");
                setMessageType("success");
                setOpen(true);
                setSelectedUserIds([]); // Clear selections after successful invite
                props.Close();
            } else {
                setMessage(data.message || "Failed to send invites.");
                setMessageType("error");
                setOpen(true);
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
        <>
            <DialogTitle id="alert-dialog-blue-border" sx={{ bgcolor: "rgba(136, 219, 255, 1)", borderTop: "0.15vw solid black", borderLeft: "0.15vw solid black", borderRight: "0.15vw solid black" }}>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: "rgba(0, 0, 0, 0.8)", borderLeft: "0.15vw solid black", borderRight: "0.15vw solid black" }}>
                <DialogContentText id="alert-dialog-logout" sx={{ display: "flex", justifyContent: "center", color: "white", marginTop: "1vw" }}>
                    {/* displays the inputed question */}
                    {props.Question}
                </DialogContentText>

                <form id="InviteForm" onSubmit={sendInvites}>
                    {/* the input that lets you select users to invite */}
                    <FormControl sx={styledTextField} style={{ display: "flex", justifyContent: "center", width: "20vw" }}>
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
                </form>
            </DialogContent>

            {/* Cancel and confirm buttons */}
            <DialogActions sx={{ display: "flex", justifyContent: "center", padding: "0", bgcolor: "rgba(0, 0, 0, 0.8)" }}>
                <ButtonGroup variant="contained" sx={{ bgcolor: "rgba(47, 49, 55, 1)", width: "100%", border: "0.15vw solid black" }} aria-label="Basic button group">
                    <Button variant="contained" sx={{ bgcolor: "rgba(47, 49, 55, 1)", width: "100%" }} onClick={props.Close}>
                        Cancel
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: "rgba(47, 49, 55, 1)", width: "100%" }} type="submit" form="InviteForm">
                        Confirm
                    </Button>
                </ButtonGroup>
            </DialogActions >

            {/* Snackbar for displaying messages */}
            {message && <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={messageType !== "error" && messageType !== '' ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
            }
        </>
    )
}