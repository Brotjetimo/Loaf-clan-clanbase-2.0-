import { useEffect, useState } from "react";
import Cookies from 'js-cookie'

import Grid from '@mui/material/Grid2';
import { Typography } from "@mui/material";
import AccountBoxes from '../../components/AccountBoxes';
import { borderText } from '../../components/styles';

import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import GroupIcon from '@mui/icons-material/Group';

interface UserProfile {
    id: string;
    username: string;
    age: number;
    email: string;
    gamepreference: string;
    user_role: string;
    team_name: string;
}

export default function AccountPrivateInfo() {

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
            sx={borderText}
            style={{ color: 'red' }}
        >
            {errorMessage}
        </Typography>;
    }

    return (
        <Grid size={5} container>
            <Grid size={12}>
                <Typography
                    variant="h3"
                    sx={borderText}
                    style={{ color: "white" }}
                >
                    Personal information
                </Typography>
            </Grid>

            <Grid size={12}>
                <Typography
                    variant="h5"
                    sx={borderText}
                    style={{ color: "gray", marginBottom: "2vh" }}
                >
                    Manage your personal information here by viewing all the details you’ve provided,
                    including when you created your account.
                </Typography>
            </Grid>

            <AccountBoxes boxTitle={"Name"} boxInfo={!profile ? "???" : profile.username} icon={PersonIcon} />

            <Grid size={0.5} />

            <AccountBoxes boxTitle={"Email"} boxInfo={!profile ? "???" : profile.email} icon={EmailIcon} />
            <AccountBoxes boxTitle={"Age"} boxInfo={!profile ? "???" : profile.age} icon={TodayIcon} />

            <Grid size={0.5} />

            <AccountBoxes boxTitle={"Preference"} boxInfo={!profile ? "???" : profile.gamepreference} icon={SportsEsportsIcon} />
            <AccountBoxes boxTitle={"Joined Team"} boxInfo={!profile ? "???" : profile.team_name} icon={GroupIcon} />

            <Grid size={0.5} />

            <AccountBoxes boxTitle={"Roles"} boxInfo={!profile ? "???" : profile.user_role} icon={PriorityHighIcon} />
        </Grid >
    )
}