// all react imports
import { useEffect, useState } from 'react';

// all router imports
import { useNavigate, useParams } from "react-router";
import Cookies from 'js-cookie'

// all material ui component imports
import { Box, Button, Typography } from '@mui/material';

// all the imported styles
import { arrayTextBox, borderText, buttonThemeDelete, buttonThemeSubmit, centeredGridText, competitionInfoArrayBox, competitionInfoPageBox, fullCompetitionPicture, middleScreenLoading } from '../components/styles';

// all custom made component imports
import TeamMember from '../components/TeamMember';
import CompetitionInfoGapthBox from '../components/CompetitionInfoGrapthBar';
import CompetitionPointSubmit from '../components/CompetitionPointSubmit';

function CompetitionsInfo() {
    // a function that checks if the user is logged in and redirects the user to the home page if they are not.
    const navigate = useNavigate();
    const [, setRedirect] = useState(false);

    const token = Cookies.get('token')
    if (token != null) {
        console.log(token)
    } else {
        navigate('/')
    }
    useEffect(() => {
        const storedToken = Cookies.get("token");
        if (!storedToken) {
            setRedirect(true);
            return;
        }
    }, []);

    // a placeholder function added for some testing of a for loop controlling the ammount of teammembers displayed
    // const placeholder = () => {
    //     console.log("placeholder")
    // }

    const { competitionId } = useParams();
    const [competition, setCompetition] = useState<any>(null);
    const [teams, setTeams] = useState<any[]>([]);

    const [, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [, setVerifications] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchCompetitionDetails = async () => {
            setLoading(true);
            const token = Cookies.get("token");

            if (!token) {
                setMessage("You must be logged in to view competition details.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/competition-info`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ competitionId }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch competition details.");
                }


                const data = await response.json();
                console.log("Fetched competition data:", data);
                setCompetition(data.competition);
                setTeams(data.teams || []);
                // console.log("fetched teams: ", data.teams)
            } catch (error: any) {
                console.error("Error fetching competition details:", error);
                setMessage(error.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitionDetails();
    }, [competitionId]);

    const handleReportResult = async (teamId: string, result: 'win' | 'loss') => {
        const payload = {
            competitionId,
            teamId,
            result,
        };

        if (!competitionId || !teamId || !result) {
            console.error("Missing required parameters:", { competitionId, teamId, result });
            setMessage("Missing required parameters.");
            return;
        }

        const token = Cookies.get("token");
        if (!token) {
            setMessage("You must be logged in to verify results.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/report-result`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error from backend:", errorData);
                throw new Error("Failed to report result.");
            }

            const data = await response.json();
            setMessage(data.message || "Verification successful.");
            setVerifications((prev) => ({ ...prev, [teamId]: result === 'win' }));
        } catch (error: any) {
            console.error("Error reporting result:", error);
            setMessage(error.message || "An error occurred.");
            setVerifications((prev) => ({ ...prev, [teamId]: false }));
        }
    };

    if (loading) {
        return <Typography
            variant="h2"
            sx={middleScreenLoading}
            style={{ color: "white" }}
        >
            Loading competition details...
        </Typography>
    }

    return (
        <Box>
            {/* competition image box */}
            <Box sx={centeredGridText}>
                <Box sx={fullCompetitionPicture} style={{ backgroundColor: "rgba(79, 69, 42, 1)", padding: "0.5vw" }}>
                    <Typography variant='h4'
                        sx={borderText}
                        style={{ color: "white" }}>
                        Potential game/competition image
                    </Typography>
                </Box>
            </Box>

            {/* info row 1 */}
            {/* competition info box */}
            <Box sx={centeredGridText} style={{ marginTop: "0.5vw", maxHeight: "26vw" }}>
                <Box sx={competitionInfoPageBox} style={{ padding: "0.5vw", width: "31.8vw", marginRight: "0.25vw" }}>
                    <Typography variant='h4'
                        sx={borderText}
                        style={{ color: "white" }}>
                        {competition.name}
                    </Typography>

                    <Typography variant='h5'
                        sx={borderText}
                        style={{ color: "rgba(148, 149, 152, 1)" }}>
                        Start - {new Date(competition.start_date).toLocaleString()}
                    </Typography>

                    <Typography variant='h5'
                        sx={borderText}
                        style={{ color: "rgba(148, 149, 152, 1)" }}>
                        End - {new Date(competition.end_date).toLocaleString()}
                    </Typography>

                    <Typography variant='h5'
                        sx={borderText}
                        style={{ color: "rgba(148, 149, 152, 1)", marginTop: "0.5vw" }}>
                        Discription
                    </Typography>

                    <Box sx={competitionInfoArrayBox}>
                        <Typography variant='h5'
                            sx={borderText}
                            style={{ color: "rgba(148, 149, 152, 1)" }}>
                            {competition.description === undefined || competition.description === "" || competition.description === null
                                ? "No description available"
                                : competition.description}
                        </Typography>
                    </Box>
                </Box>

                {/* game info box */}
                <Box sx={competitionInfoPageBox} style={{ padding: "0.5vw", width: "31.8vw" }}>
                    <Typography variant='h4'
                        sx={borderText}
                        style={{ color: "white" }}>
                        {competition.game}
                    </Typography>

                    <Typography variant='h5'
                        sx={borderText}
                        style={{ color: "rgba(148, 149, 152, 1)" }}>
                        {competition.game_type}
                    </Typography>

                    <Typography variant='h5'
                        sx={borderText}
                        style={{ color: "rgba(148, 149, 152, 1)", marginTop: "2.5vw" }}>
                        Joined teams
                    </Typography>

                    <Box sx={competitionInfoArrayBox}>
                        {teams.map((team) => (
                            <TeamMember key={team.team_id}
                                username={team.team_name || "No Teams Available"}
                                role={"loggedInUserRole"}
                                userRole={"user"}
                                clicked={() => handleReportResult(team.team_id, 'win')} />))}
                    </Box>

                    <Box style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", }}>
                        <Box style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "100%" }}>
                            <Typography
                                variant='h5'
                                sx={borderText}
                                style={{ color: "rgba(74, 182, 236, 1)", marginRight: "0.5vw" }}>
                                {competition.joined_teams}/{competition.max_teams} Teams
                            </Typography>

                            <Typography
                                variant='h5'
                                sx={borderText}
                                style={{ color: "white" }}>
                                joined
                            </Typography>
                        </Box>

                        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                variant="contained"
                                sx={buttonThemeDelete}
                                style={{ width: "8vw", height: "3vw" }}

                            >
                                <h2 style={{ fontSize: "1.2rem" }}>Leave</h2>
                            </Button>

                            <Button
                                variant="contained"
                                sx={buttonThemeSubmit}
                                style={{ width: "8vw", height: "3vw", margin: "0 0 0 1vw" }}
                                type="submit"
                            >
                                <h2 style={{ fontSize: "1.2rem" }}>Join</h2>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/*info row 2 */}
            {/* verificatioin box */}
            <Box sx={centeredGridText} style={{ marginTop: "0.5vw" }}>
                <Box sx={competitionInfoPageBox} style={{ padding: "0.5vw", width: "31.8vw", height: "26vw", marginRight: "0.25vw" }}>
                    <Typography variant='h4'
                        sx={borderText}
                        style={{ color: "white" }}>
                        Verification
                    </Typography>

                    {/* competition submit components that lets the team leader submit their point total */}
                    <Box sx={arrayTextBox} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", height: "21.5vw", overflow: "auto" }}>
                        {teams.map((team, num) => (
                            <CompetitionPointSubmit
                            Index={num + 1}
                            TeamName={team.team_name}
                            Disabled={false}
                            Margin={Math.abs(num % 2) == 1 ? "0vw" : "1.5vw"} // checks if the index is odd or even and sets the margin accordingly 
                            Submit={() => handleReportResult(team.team_id, 'win')} />
                        ))}
                    </Box>
                </Box>

                {/* results box */}
                <Box sx={competitionInfoPageBox} style={{ padding: "0.5vw", width: "31.8vw", height: "26vw" }}>
                    <Typography variant='h4'
                        sx={borderText}
                        style={{ color: "white" }}>
                        Results
                    </Typography>

                    <Box sx={arrayTextBox} style={{ height: "21.5vw", maxHeight: "22vw", overflow: "auto" }}>
                        <Typography variant='h5'
                            sx={borderText}
                            style={{ color: "white" }}>
                            Winning Team:
                        </Typography>

                        <Typography variant='h5'
                            sx={borderText}
                            style={{ color: "rgba(148, 149, 152, 1)" }}>
                            Team name
                        </Typography>

                        {/* grapths (static) showing who is 1st place, second place and 3rd place in the competition */}
                        <Box style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-end", marginTop: "1vw", height: "15vw" }}>
                            <CompetitionInfoGapthBox Placement="2nd" Points="100" TeamName="Team Name" Height="5vw" Margin="1vw" />

                            <CompetitionInfoGapthBox Placement="1st" Points="120" TeamName="Team Name" Height="7.5vw" Margin="1vw" />

                            <CompetitionInfoGapthBox Placement="3rd" Points="80" TeamName="Team Name" Height="2.5vw" Margin="0vw" />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}

export default CompetitionsInfo