import Grid from '@mui/material/Grid2';
import { Box, Typography } from "@mui/material";
import Button from '@mui/material/Button';

import { borderText, buttonThemeDisabled, buttonThemeKick, teamMemberBox } from './styles';

interface Users {
    username: string;
    role: string;
    userRole: string;
    clicked: () => void;
}

export default function TeamMembers(props: Users) {

    return (
        <Box sx={teamMemberBox}>
            <Grid container>

                <Typography
                    variant="h6"
                    sx={borderText}
                    style={props.role === "team_leader" ? { color: "white", marginRight: "1vw" } : { color: "white" }}>
                    {props.username}
                </Typography>

                {props.role === "team_leader" ?
                    <Grid size={2.5}
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}>

                        {props.userRole === "team_leader" ?
                            <Button sx={buttonThemeDisabled}
                                style={{ borderRadius: "1vw", height: "1.5vw" }}
                                disabled
                            >
                                <Typography
                                    variant="caption"
                                    sx={borderText}
                                    style={{ color: "white" }}>
                                    Owner
                                </Typography>
                            </Button>
                            :
                            <Button sx={buttonThemeKick}
                                style={{ borderRadius: "1vw", height: "1.5vw" }}
                                onClick={props.clicked}
                            >
                                <Typography
                                    variant="caption"
                                    sx={borderText}
                                    style={{ color: "white" }}>
                                    kick
                                </Typography>
                            </Button>
                        }
                    </Grid>
                    :
                    <Grid size={2.5}
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}>

                        {props.userRole === "team_leader" ?
                            <Button sx={buttonThemeDisabled}
                                style={{ borderRadius: "1vw", height: "1.5vw", marginLeft: "1vw" }}
                                disabled
                            >
                                <Typography
                                    variant="caption"
                                    sx={borderText}
                                    style={{ color: "white" }}>
                                    Owner
                                </Typography>
                            </Button>

                            :
                            <></>
                        }
                    </Grid>
                }
            </Grid>
        </Box>
    )
}