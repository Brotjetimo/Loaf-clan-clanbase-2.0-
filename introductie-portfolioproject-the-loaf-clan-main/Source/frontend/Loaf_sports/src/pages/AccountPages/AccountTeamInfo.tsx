import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import Grid from '@mui/material/Grid2';
import { Box, Dialog, Typography } from "@mui/material";
import Button from '@mui/material/Button';

import TeamMembers from '../../components/TeamMember';

import { accountBox, arrayTextBox, borderText, buttonThemeBlue, buttonThemeDelete } from '../../components/styles';
import { useNavigate } from "react-router";
import AreSureAlert from "../../components/AreSureAlert";
import React from "react";
import InviteAlert from "../../components/InviteAlert";


interface TeamMember {
    username: string;
    role: string;
    userId: string;
}

export default function AccountTeamInfo() {
    // Navigation for the create team button
    const navigate = useNavigate();
    const toCreateTeams = () => {
        navigate("/TeamsCreate");
    };

    // const [hasTeam, setHasTeam] = useState<boolean>(false)
    const [teamName, setTeamName] = useState<string>("");
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loggedInUserRole, setLoggedInUserRole] = useState<string>("");
    const [hasTeam, setHasTeam] = useState<boolean>(true);
    const [_errorMessage, setErrorMessage] = useState<string>("");
    const [_successMessage, setSuccessMessage] = useState<string>("");
    const [_loading, setLoading] = useState<boolean>(false);

    // Helper to check the token
    const getToken = () => {
        const token = Cookies.get("token");
        if (!token) {
            setErrorMessage("You must be logged in to perform this action.");
        }
        return token;
    };

    // Fetch team details
    const fetchTeamDetails = async () => {
        setLoading(true); // Start loading
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/team-members", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                setTeamName(data.teamName);
                setTeamMembers(data.members); // Set members data, including userId
                setLoggedInUserRole(data.loggedInUserRole || "");
                setErrorMessage("");

            } else {
                setErrorMessage(data.message || "Failed to fetch team details.");
            }
        } catch (error) {
            console.error("Error fetching team details:", error);
            setErrorMessage("Error connecting to the server.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchTeamDetails();
    }, [hasTeam]);

    // Leave the team
    const leaveTeam = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/team-members?action=leave-team", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message);
                setTeamName("");
                setTeamMembers([]);
            } else {
                setErrorMessage(data.message || "Failed to leave the team.");
            }
        } catch (error) {
            console.error("Error leaving the team:", error);
            setErrorMessage("Error connecting to the server.");
        }
    };

    // Delete the team
    const deleteTeam = async () => {
        setLoading(true); // Start loading
        const token = getToken(); // Fetch the token
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/team-members?action=delete-team", {
                method: "POST", // Send a POST request instead of DELETE
                headers: {
                    Authorization: `Bearer ${token}`, // Send the token in Authorization header
                },
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Team deleted successfully.");
                setTeamName(""); // Reset team name
                setTeamMembers([]); // Clear team members
            } else {
                setErrorMessage(data.message || "Failed to delete the team.");
            }
        } catch (error) {
            console.error("Error deleting the team:", error);
            setErrorMessage("Error connecting to the server.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // All alert functions
    // Delete alert
    const [, setAnchorElDelete] = React.useState<null | HTMLElement>(null);

    const [alertDeleteOpen, setAlertDeleteOpen] = React.useState(false);

    const alertDeleteHandleClickOpen = () => {
        setAlertDeleteOpen(true);
    };

    const alertDeleteHandleClose = () => {
        setAlertDeleteOpen(false);
        setAnchorElDelete(null);
    };

    const handledDelete = async () => {
        await deleteTeam();
        alertDeleteHandleClose();
        setHasTeam(false);
    };

    const handledLeave = async () => {
        await leaveTeam();
        alertDeleteHandleClose();
        setHasTeam(false);
    };

    // Kick alert
    const [, setAnchorElKick] = React.useState<null | HTMLElement>(null);

    const [alertKickOpen, setAlertKickOpen] = React.useState(false);
    const [kickUserId, setKickUserId] = React.useState("");
    const [kickUserName, setKickUserName] = React.useState("");

    const alertKickHandleClickOpen = (userId: string, userName: string) => {
        setAlertKickOpen(true);
        setKickUserId(userId);
        setKickUserName(userName);
    };

    const alertKickHandleClose = () => {
        setAlertKickOpen(false);
        setAnchorElKick(null);
        setKickUserId("");
        setKickUserName("");
    };

    const handledKick = async () => {
        await handleKickMember(kickUserId)
        alertKickHandleClose()
    }

    // Invite alert
    const [, setAnchorElInvite] = React.useState<null | HTMLElement>(null);

    const [alertInviteOpen, setAlertInviteOpen] = React.useState(false);

    const alertInviteHandleClickOpen = () => {
        setAlertInviteOpen(true);
    };

    const alertInviteHandleClose = () => {
        setAlertInviteOpen(false);
        setAnchorElInvite(null);
    };

    // Handle the action to kick a user
    const handleKickMember = async (userId: string) => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/team-members?action=kick-member", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId }),  // Pass the userId in the request body
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Member kicked successfully!");
                fetchTeamDetails(); // Refresh the team members list after successful kick
            } else {
                setErrorMessage(data.message || "Failed to kick member.");
            }
        } catch (error) {
            console.error("Error kicking member:", error);
            setErrorMessage("Error connecting to the server.");
        }
    };


    return (
        <Grid size={5} container>
            <Grid size={12}>
                <Typography
                    variant="h3"
                    sx={borderText}
                    style={{ color: "white" }}
                >
                    My Teams
                </Typography>
            </Grid>

            <Grid size={12}>
                <Typography
                    variant="h5"
                    sx={borderText}
                    style={{ color: "gray", marginBottom: "2vh" }}
                >
                    Manage you teams here by ether creating a team or seeing a joined one.
                </Typography>
            </Grid>

            <Grid size={12}>
                <Box sx={accountBox}>
                    <Typography
                        variant="h4"
                        sx={borderText}
                        style={{ color: "white" }}>
                        {teamName}
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={borderText}
                        style={{ color: "white" }}>
                        {loggedInUserRole === "team_leader" && hasTeam ? "Owner"
                            : loggedInUserRole === "teamate" && hasTeam ? "Member"
                                : "Not in a team"}
                    </Typography>

                    {(loggedInUserRole === "team_leader" || loggedInUserRole === "teamate") && hasTeam ?
                        <Box>
                            <Typography
                                variant="h5"
                                sx={borderText}
                                style={{ color: "gray" }}
                            >
                                Team members
                            </Typography>

                            <Box sx={arrayTextBox} style={{ marginBottom: "1vw" }}>
                                <Grid size={12}>
                                    <Grid container>
                                        {teamMembers.map((user, index) => (
                                            <TeamMembers key={index}
                                                username={user.username}
                                                role={loggedInUserRole}
                                                userRole={user.role}
                                                clicked={() => alertKickHandleClickOpen(user.userId, user.username)} />
                                        )).sort()}
                                    </Grid>
                                </Grid>
                            </Box>

                            <Grid container>
                                <Grid size={6}>
                                    <Button sx={buttonThemeDelete} onClick={alertDeleteHandleClickOpen}>
                                        <Typography
                                            variant="h6"
                                            sx={borderText}
                                            style={{ color: "white" }}>
                                            {loggedInUserRole === "team_leader" ? "Delete team" : "Leave team"}
                                        </Typography>
                                    </Button>
                                </Grid>

                                <Grid size={6} sx={{ display: "flex", justifyContent: "right" }}>
                                    <Button sx={buttonThemeBlue} onClick={alertInviteHandleClickOpen}>
                                        <Typography
                                            variant="h6"
                                            sx={borderText}
                                            style={{ color: "white" }}>
                                            Invite members
                                        </Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        :
                        <></>
                    }
                </Box>
            </Grid>

            <Button sx={buttonThemeBlue} style={{ width: "100%", height: "3.5vw" }} onClick={toCreateTeams}>
                <Typography
                    variant="h5"
                    sx={borderText}
                    style={{ color: "white" }}>
                    Create a Team
                </Typography>
            </Button>

            <Typography
                variant="h6"
                sx={borderText}
                style={{ color: "gray" }}
            >
                Keep in mind that you can only have 1 team at a time.
                This means that if you create a team then your old team will be left or deleted.
            </Typography>

            <Dialog
                open={alertDeleteOpen}
                onClose={alertDeleteHandleClose}
                aria-describedby="alert-dialog-delete"
            >
                <AreSureAlert Question={"Are you sure you want to " + (loggedInUserRole === "team_leader" ? "delete " : "leave ") + "team " + teamName}
                    Clicked={loggedInUserRole === "team_leader" ? handledDelete : handledLeave}
                    Close={alertDeleteHandleClose} />
            </Dialog>

            {/* delete/leave team pop-up */}
            <Dialog
                open={alertKickOpen}
                onClose={alertKickHandleClose}
                aria-describedby="alert-dialog-kick"
            >
                <AreSureAlert Question={"Are you sure you want to kick user " + (kickUserName) + "?"}
                    Clicked={handledKick}
                    Close={alertKickHandleClose} />
            </Dialog>

            <Dialog
                open={alertInviteOpen}
                onClose={alertInviteHandleClose}
                aria-describedby="alert-dialog-invite"
            >
                <InviteAlert Question="Choose here who you want to invite"
                    Close={alertInviteHandleClose}/>
            </Dialog>
        </Grid >
    )
}