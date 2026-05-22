// all react imports
import React from "react";
import { useEffect, useState } from "react";

// all router imports
import { useNavigate } from "react-router";
import Cookies from 'js-cookie'

// all basic material ui imports
import Grid from '@mui/material/Grid2';
import { Box, Typography, Avatar, Dialog } from "@mui/material";
import Button from '@mui/material/Button';

// all icon imports
import PersonIcon from '@mui/icons-material/Person';

// all style imports
import { normalStyledButton, centeredGridText, defaultBarStyled, borderText, middleScreenLoading } from "../components/styles";

// all page renders
import AccountPrivateInfo from "./AccountPages/AccountPrivateInfo";
import AccountTeamInfo from "./AccountPages/AccountTeamInfo";

// all the components used
import AccountBoxes from "../components/AccountBoxes";
import AreSureAlert from "../components/AreSureAlert";

// this interface is used for getting the username and email from the user
interface UserProfile {
    username: string;
    age: number;
    email: string;
}

// this enum is used for navigation in the page
enum PageContent {
    UserInfo,
    Teams,
    Competitions,
}

function Account() {
    // all rendering functions
    const [pageContent, setPageContent] = useState<PageContent>(PageContent.UserInfo)

    const renderUserInfo = () => {
        setPageContent(PageContent.UserInfo)
    }

    const renderTeamInfo = () => {
        setPageContent(PageContent.Teams)
    }

    const renderCompetitionInfo = () => {
        setPageContent(PageContent.Competitions)
    }

    const navigate = useNavigate();
    const [, setRedirect] = useState(false);

    const token = Cookies.get('token')
    if (token != null) {
        console.log(token)
    } else {
        navigate('/')
    }

    // all sign out (alert functions)
    const [, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [alertOpen, setAlertOpen] = React.useState(false);

    const alertHandleClickOpen = () => {
        setAlertOpen(true);
    };

    const alertHandleClose = () => {
        setAlertOpen(false);
        setAnchorEl(null);
    };

    useEffect(() => {
        const storedToken = Cookies.get("token");
        if (!storedToken) {
            setRedirect(true);
            return;
        }
    }, []);

    const deleteToken = () => {
        Cookies.remove("token");
        navigate("/SignIn");
    };

    // the functions below are for errors and getting the information for the account display.
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

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

    if (errorMessage) {
        return <Typography
            variant="h2"
            sx={middleScreenLoading}
            style={{ color: "red" }}
        >
            {errorMessage}
        </Typography>;
    }

    if (!profile) {
        return <Typography
            variant="h2"
            sx={middleScreenLoading}
            style={{ color: "white" }}
        >
            Loading profile...
        </Typography>;
    }

    return (
        <>
            {/* title + sign out button */}
            <Grid container sx={centeredGridText} style={{ marginBottom: "3vw" }}>
                <Grid size={6} sx={centeredGridText}>
                    <Typography
                        variant="h4"
                        sx={borderText}
                        style={{ color: "white" }}
                    >
                        Account details
                    </Typography>
                </Grid>

                <Grid size={6} sx={centeredGridText}>
                    <Button
                        variant="contained"
                        sx={normalStyledButton}
                        onClick={alertHandleClickOpen}
                    >
                        <Typography
                            variant="h6"
                            sx={borderText}
                            style={{ color: "white" }}
                        >
                            Sign out
                        </Typography>
                    </Button>
                </Grid>

                <Dialog
                    open={alertOpen}
                    onClose={alertHandleClose}
                    aria-describedby="alert-dialog-logout"
                >
                    <AreSureAlert Question={"Are you sure you want to log out?"} Clicked={deleteToken} Close={alertHandleClose} />
                </Dialog>

                <Box sx={defaultBarStyled} style={{ width: "66%", marginTop: "2vh" }}> </Box>
            </Grid>

            {/* Left Account info and navigations */}
            <Grid container sx={centeredGridText}>
                <Grid size={3} container>
                    <Box>
                        <Grid size={12}>
                            <Avatar sx={{ border: "0.1vw solid black", color: "black", bgcolor: "white", width: "10vw", height: "10vw", marginBottom: "1vh" }} />
                        </Grid>

                        <Grid size={12}>
                            <Typography
                                variant="h4"
                                sx={borderText}
                                style={{ color: "white" }}
                            >
                                {profile.username}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography
                                variant="h5"
                                sx={borderText}
                                style={{ color: "gray" }}
                            >
                                {profile.email}</Typography>
                        </Grid>

                        {/* switches renders to the personal information renders*/}
                        <Grid size={12}>
                            <Button variant="text"
                                style={pageContent == PageContent.UserInfo
                                    ? { color: "rgba(74, 182, 236, 1)", marginTop: "3vw" }
                                    : { color: "white", marginTop: "3vw" }}
                                onClick={renderUserInfo}
                            >
                                <Typography
                                    variant="h5"
                                    sx={borderText}
                                >
                                    My personal information
                                </Typography>
                            </Button>
                        </Grid>

                        {/* switches renders to the team info renders */}
                        <Grid size={12}>
                            <Button variant="text"
                                style={pageContent == PageContent.Teams
                                    ? { color: "rgba(74, 182, 236, 1)" }
                                    : { color: "white" }}
                                onClick={renderTeamInfo}
                            >
                                <Typography
                                    variant="h5"
                                    sx={borderText}
                                >
                                    My teams
                                </Typography>
                            </Button>
                        </Grid>

                        {/* switches renders to the competition renders */}
                        <Grid size={12}>
                            <Button variant="text"
                                style={pageContent == PageContent.Competitions
                                    ? { color: "rgba(74, 182, 236, 1)" }
                                    : { color: "white" }}
                                onClick={renderCompetitionInfo}
                            >
                                <Typography
                                    variant="h5"
                                    sx={borderText}
                                >
                                    My Competitions
                                </Typography>
                            </Button>
                        </Grid>

                    </Box>
                </Grid>

                {/* all the page content */}
                {pageContent == PageContent.UserInfo ?
                    <AccountPrivateInfo />
                    : pageContent == PageContent.Teams ?
                        <AccountTeamInfo />
                        :
                        <AccountBoxes boxTitle={"Age"} boxInfo={profile.age} icon={PersonIcon} />
                }

            </Grid >
        </>
    )
}

export default Account