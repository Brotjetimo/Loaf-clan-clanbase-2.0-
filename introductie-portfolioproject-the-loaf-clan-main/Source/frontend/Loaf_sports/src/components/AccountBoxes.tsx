import Grid from '@mui/material/Grid2';
import { Box, SvgIconTypeMap, Typography } from "@mui/material";

import {borderText, accountBox, accountBoxIcon } from "../components/styles";
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface UserProfile {
    boxTitle: string;
    boxInfo: string | number;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export default function AccountBoxes(props :UserProfile) {

    return (
        <Grid size={5.75}>
            <Box sx={accountBox}>
                <Grid container>
                    <Grid size={10.5}>
                        <Typography
                            variant="h4"
                            sx={borderText}
                            style={{ color: "white", }}
                        >
                            {props.boxTitle}
                        </Typography>
                    </Grid>

                    <Grid size={1.5}>
                        <props.icon sx={accountBoxIcon} />
                    </Grid>
                </Grid>

                <Typography
                    variant="h5"
                    sx={borderText}
                    style={{ color: "gray", paddingBottom: "2vh" }}
                >
                    {props.boxInfo != "" && props.boxInfo != null ? props.boxInfo : "None selected"}
                </Typography>
            </Box>
        </Grid>
    )
}