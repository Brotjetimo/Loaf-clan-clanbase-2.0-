import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';
import Typography from "@mui/material/Typography";
import { Avatar, Box, Dialog } from "@mui/material";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AreSureAlert from "./AreSureAlert";

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

type Notification = {
  id: number;
  type: string;
  team_name: string;
  status: string;
};

function Navbar() {
  // all notification functions
  const [anchorElNotifications, setAnchorElNotifications] = React.useState<null | HTMLElement>(null);
  const openNotifications = Boolean(anchorElNotifications);
  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const onNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  //
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotifications = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setErrorMessage("You must be logged in to view notifications.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications);
      } else {
        setErrorMessage(data.message || "Failed to fetch notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setErrorMessage("Error connecting to the server.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const respondToInvite = async (notificationId: number, response: "accepted" | "declined") => {
    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost:3000/respond-invite", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId, response }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );
      } else {
        console.error("Error responding to invite:", data.message);
      }
    } catch (error) {
      console.error("Error responding to invite:", error);
    }
  }
  // all other functions
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();

  const hasToken = Cookies.get("token");
  const deleteToken = () => {
    Cookies.remove("token");
    setAnchorElAccount(null);
    setAlertOpen(false);
    navigate("/SignIn");
  };

  const [anchorElAccount, setAnchorElAccount] = React.useState<null | HTMLElement>(null);
  const openAccount = Boolean(anchorElAccount);
  const handleAccountClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAccount(event.currentTarget);
  };

  const onAccountClose = () => {
    setAnchorElAccount(null);
  };

  const goToAccount = () => {
    setAnchorElAccount(null);
    navigate('/Account');
  };

  // alert functions
  const [alertOpen, setAlertOpen] = React.useState(false);

  const alertHandleClickOpen = () => {
    setAlertOpen(true);
  };

  const alertHandleClose = () => {
    setAlertOpen(false);
    setAnchorElAccount(null);
  };


  return (
    <Box style={{ borderBottom: "0.15vw solid black", borderTop: "0.15vw solid black", backgroundColor: "rgba(0, 0, 0, 0.2)", padding: "1vw", paddingRight: "8vw", paddingLeft: "8vw", marginBottom: "1.5vw" }}>

      <Grid container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Grid size={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography
            variant="h6"
            sx={{
              justifyContent: "center",
              color: "white",
            }}
          >
            Loaf (e)Sports
          </Typography>
        </Grid>

        <Grid size={5} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Link to="/">
            <Button variant="text"
              style={location.pathname === "/"
                ? { color: "rgba(74, 182, 236, 1)" }
                : { color: "white" }}
            ><p>Home</p></Button>
          </Link>

          <Link to="/Competitions">
            <Button variant="text"
              style={location.pathname.includes("/Competition")
                ? { color: "rgba(74, 182, 236, 1)" }
                : { color: "white" }}
            ><p>Competitions</p></Button>
          </Link>

          <Link to="/Forums">
            <Button variant="text"
              style={location.pathname === "/Forums"
                ? { color: "rgba(74, 182, 236, 1)" }
                : { color: "white" }}
            ><p>Forums</p></Button>
          </Link>

          <Link to="/Teams">
            <Button variant="text"
              style={location.pathname === "/Teams"
                ? { color: "rgba(74, 182, 236, 1)" }
                : { color: "white" }}
            ><p>Teams</p></Button>
          </Link>

          <Link to="/Support">
            <Button variant="text"
              style={location.pathname === "/Support"
                ? { color: "rgba(74, 182, 236, 1)" }
                : { color: "white" }}
            ><p>Support</p></Button>
          </Link>
        </Grid>

        <Grid size={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {hasToken == null
            ?
            <Link to="/SignIn">
              <Button variant="text"
                style={location.pathname === "/SignIn" || location.pathname === "/SignUp"
                  ? { color: "rgba(74, 182, 236, 1)" }
                  : { color: "white" }}
              ><p>Login</p>
              </Button>
            </Link>

            :
            <>
              {notifications.length !== 0 && !errorMessage ?
                <IconButton
                  style={{ color: "white" }}
                  id="notifications"
                  aria-controls={openNotifications ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openNotifications ? 'true' : undefined}
                  onClick={handleNotificationsClick}
                ><NotificationImportantIcon sx={{ color: "white" }} /></IconButton>
                :
                <IconButton
                  style={{ color: "white" }}
                  id="notifications"
                  aria-controls={openNotifications ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openNotifications ? 'true' : undefined}
                  onClick={handleNotificationsClick}
                ><NotificationsIcon sx={{ color: "white" }} /></IconButton>
              }

              <IconButton
                style={{ color: "white" }}
                id="avatar"
                aria-controls={openAccount ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openAccount ? 'true' : undefined}
                onClick={handleAccountClick}
              >
                <Avatar sx={{ border: "0.1vw solid black", color: "black", bgcolor: "white", width: "2.5vw", height: "2.5vw" }}
                  style={location.pathname === "/Account" || location.pathname === "/TeamsCreate"
                    ? { backgroundColor: "rgba(74, 182, 236, 1)" }
                    : { backgroundColor: "white" }} />
              </IconButton>
            </>
          }
        </Grid>

        {/* notifications */}
        <Menu
          id="basic-menu"
          anchorEl={anchorElNotifications}
          open={openNotifications}
          onClose={onNotificationsClose}
          style={{ maxWidth: "90vw" }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}

        >
          <Box style={{ paddingLeft: "0.5vw", paddingRight: "0.5vw" }}>
            <Typography
              variant="h5"
              style={{ textShadow: "none" }}
            >Notifications
            </Typography>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {notifications.length === 0 && !errorMessage && (
              <Typography
                variant="subtitle2"
                style={{ textShadow: "none" }}
              >No notifications to display :/
              </Typography> // <-- Add fallback message
            )}
          </Box>

          {notifications.map((notif) => (
            <li key={notif.id}>
              {notif.type === "team_invite" && (
                <Box style={{ paddingRight: "0.5vw", paddingLeft: "0.5vw" }}>
                  <Typography
                    variant="subtitle2"
                    style={{ textShadow: "none" }}>
                    Team Invite:
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    style={{ textShadow: "none", marginBottom: "0.5vw" }}>
                    You've been invited to join {""}
                    <b>{notif.team_name}</b>.
                  </Typography>

                  <Box style={{ borderBottom: "solid", paddingBottom: "0.5vw", color: "gray" }}>
                    <Button variant="contained"
                      size="small"
                      sx={{ bgcolor: "rgba(47, 49, 55, 1)", width: "35%", marginRight: "30%" }}
                      onClick={() => respondToInvite(notif.id, "declined")}>
                      Decline
                    </Button>
                    <Button variant="contained"
                      size="small"
                      sx={{ bgcolor: "rgba(47, 49, 55, 1)", width: "35%" }}
                      onClick={() => respondToInvite(notif.id, "accepted")}>
                      Accept
                    </Button>
                  </Box>
                </Box>
              )}
            </li>
          ))}
        </Menu>

        {/* account menu */}
        <Menu
          id="basic-menu"
          anchorEl={anchorElAccount}
          open={openAccount}
          onClose={onAccountClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={goToAccount}>My account</MenuItem>
          <MenuItem onClick={alertHandleClickOpen}>Logout</MenuItem>
        </Menu>

        <Dialog
          open={alertOpen}
          onClose={alertHandleClose}
          aria-describedby="alert-dialog-logout"
        >
          <AreSureAlert Question={"Are you sure you want to log out?"} Clicked={deleteToken} Close={alertHandleClose} />
        </Dialog>

      </Grid>
    </Box>
  )
}

export default Navbar