import { Box, Button, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { borderText, buttonThemeBlue, buttonThemeDisabled, competitionInfoBox, competitionPicture } from "./styles";

interface style {
    Color: string;
    Name: string;
    StartDate: string;
    EndDate: string;
    GameType: string;
    IsJoined: number;
    JoinedTeams: number;
    MaxTeams: number;
    Clicked: () => void;
    Link: () => void;
    UserRole: string;
}

export default function CompetitionBox(props: style) {

    return (
        <Grid size={5.5} style={{ marginBottom: "1vw", marginRight: "1vw" }}>
            <Box sx={competitionPicture} style={{ backgroundColor: props.Color, padding: "0.5vw", cursor: "pointer" }} onClick={props.Link}>
                <Typography variant='h5'
                    sx={borderText}
                    style={{ color: "white" }}>
                    Potential game/competition image
                </Typography>
            </Box>

            <Box sx={competitionInfoBox} style={{ backgroundColor: "rgba(63, 66, 74, 1)", padding: "0.5vw" }}>
                <Typography
                    variant='h5'
                    sx={borderText}
                    style={{ color: "white" }}>
                    {props.Name}
                </Typography>

                <Typography
                    variant='h6'
                    sx={borderText}
                    style={{ color: "rgba(148, 149, 152, 1)" }}>
                    {props.StartDate} - {props.EndDate}
                </Typography>

                <Typography
                    variant='h6'
                    sx={borderText}
                    style={{ color: "rgba(148, 149, 152, 1)" }}>
                    {props.GameType !== null || "" ? props.GameType : "No game type specified"}
                </Typography>

                <Box style={{ display: "flex", flexDirection: "row", marginTop: "2vw" }}>
                    <Grid container size={10}>
                        <Typography
                            variant='h6'
                            sx={borderText}
                            style={props.JoinedTeams === props.MaxTeams
                                ? { color: "rgba(148, 149, 152, 1)", marginRight: "0.5vw" }
                                : { color: "rgba(74, 182, 236, 1)", marginRight: "0.5vw" }}>
                            {props.JoinedTeams}/{props.MaxTeams} Teams
                        </Typography>

                        <Typography
                            variant='h6'
                            sx={borderText}
                            style={{ color: "white" }}>
                            joined
                        </Typography>
                    </Grid>

                    <Box style={{ display: "flex", alignItems: "right" }}>
                        {props.JoinedTeams === props.MaxTeams && props.IsJoined === 0 ?
                            <Button
                                variant="contained"
                                sx={buttonThemeDisabled}
                                style={{ width: "5vw" }}>
                                full
                            </Button>
                            :
                            props.IsJoined === 1 ?
                                <Button
                                    variant="contained"
                                    sx={buttonThemeDisabled}
                                    style={{ width: "7vw" }}>
                                    joined ✓
                                </Button>
                                :
                                props.UserRole === "admin" || props.UserRole === "team_leader" ?
                                    <Button
                                        variant="contained"
                                        sx={buttonThemeBlue}
                                        style={{ width: "5vw" }}
                                        onClick={props.Clicked}>
                                        join
                                    </Button>
                                    : null
                        }
                    </Box>
                </Box>
            </Box>
        </Grid >
    )
}