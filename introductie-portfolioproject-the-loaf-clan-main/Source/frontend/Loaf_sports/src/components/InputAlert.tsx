import { ReactElement } from "react";
import { Button, ButtonGroup, DialogTitle } from "@mui/material";

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


interface CLicked {
    Question: string;
    InputedComponent: ReactElement;
    Clicked: () => void | Promise<void>;
    Close: () => void | Promise<void>;
}

export default function AreSureAlert(props: CLicked) {

    return (
        <>
            <DialogTitle id="alert-dialog-blue-border" sx={{ bgcolor: "rgba(136, 219, 255, 1)", borderTop: "0.15vw solid black", borderLeft: "0.15vw solid black", borderRight: "0.15vw solid black" }}>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: "rgba(0, 0, 0, 0.8)", borderLeft: "0.15vw solid black", borderRight: "0.15vw solid black" }}>
                <DialogContentText id="alert-dialog-logout" sx={{ color: "white", marginTop: "1vw" }}>
                    {props.Question}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: "0", display: "flex", justifyContent: "center", bgcolor: "rgba(0, 0, 0, 0.8)" }}>
                <form onSubmit={props.Clicked}>
                    {props.InputedComponent}
                    <ButtonGroup variant="contained" sx={{ bgcolor: "rgba(47, 49, 55, 1)", width: "100%", border: "0.15vw solid black" }} aria-label="Basic button group">
                        <Button variant="contained" sx={{ bgcolor: "rgba(47, 49, 55, 1)", width: "100%" }} onClick={props.Close}>
                            Cancel
                        </Button>
                        <Button variant="contained" sx={{ bgcolor: "rgba(47, 49, 55, 1)", width: "100%" }} type="submit">
                            Confirm
                        </Button>
                    </ButtonGroup>
                </form>
            </DialogActions >
        </>
    )
}