import { Typography } from "@mui/material"
import { middleScreenLoading } from "../components/styles"

function NotFound() {
    return (
        <Typography
            variant="h2"
            sx={middleScreenLoading}
            style={{ color: "red" }}
        >
            404 not NotFound
        </Typography>
    )
}

export default NotFound