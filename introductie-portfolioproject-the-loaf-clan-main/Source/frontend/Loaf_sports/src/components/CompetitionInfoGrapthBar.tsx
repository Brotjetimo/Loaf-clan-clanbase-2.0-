import { Box, Typography } from "@mui/material";
import { borderText } from "./styles";

interface GrapthInfo {
    Placement: string;
    Points: string;
    TeamName: string;
    Height: string;
    Margin: string;
}

export default function CompetitionInfoGapthBox(props: GrapthInfo) {

    return (
        <>
            <Box style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", marginRight: props.Margin  }}>
                <Typography variant='h5'
                    sx={borderText}
                    style={{ color: "white" }}>
                    {props.Placement}
                </Typography>

                {/* the blue bar */}
                <Box style={{ backgroundColor: "rgba(74, 182, 236, 1)", border: "0.15vw solid black", height: props.Height, width: "5vw" }} />

                <Typography variant='h5'
                    sx={borderText}
                    style={{ color: "white" }}>
                    {props.Points} points
                </Typography>

                <Typography variant='h5'
                    sx={borderText}
                    style={{ color: "rgba(148, 149, 152, 1)" }}>
                    {props.TeamName}
                </Typography>
            </Box>
        </>
    )
}