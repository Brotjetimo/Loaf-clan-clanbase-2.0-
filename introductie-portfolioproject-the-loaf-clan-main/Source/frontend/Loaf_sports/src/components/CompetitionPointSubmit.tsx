import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { borderText, buttonThemeDisabled, buttonThemeSubmit, styledTextField } from "./styles";

interface SubmitInfo {
    Index: number;
    TeamName: string;
    Submit: () => void;
    Disabled: boolean;
    Margin: string;
}

export default function CompetitionPointSubmit(props: SubmitInfo) {

    const [participantAmmount, setParticipantAmmount] = useState('');

    return (
        props.TeamName === "" || props.TeamName === undefined || props.TeamName === null ?
            <Box>
                <Typography variant='h5'
                    sx={borderText}
                    style={{ color: "white" }}>
                    no teams joined
                </Typography>
            </Box>
            :
            <Box style={{ display: "flex", flexDirection: "column", marginBottom: "1vw", marginRight: props.Margin }}>
                <Typography variant='h5'
                    sx={borderText}
                    style={{ color: "white" }}>
                    Point total - {props.TeamName}
                </Typography>

                <TextField
                    sx={styledTextField}
                    style={{ width: "14vw", marginLeft: "0vw" }}
                    required
                    id={`paricipantAmmount${props.Index}`}
                    label="Scored points"
                    type="Number"
                    value={participantAmmount}
                    onChange={(event) => { setParticipantAmmount(event.target.value); }}
                />

                <Button
                    variant="contained"
                    sx={props.Disabled === false ? buttonThemeSubmit : buttonThemeDisabled}
                    style={{ width: "14vw", height: "3vw", margin: "0 0 0 0" }}
                    onClick={props.Submit}
                    type="submit"
                >
                    <h2 style={{ fontSize: "1.2rem" }}>Save</h2>
                </Button>
            </Box>
    )
}