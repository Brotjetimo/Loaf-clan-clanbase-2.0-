import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function CompetitionInfo() {
  const { competitionId } = useParams();
  const [competition, setCompetition] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [verifications, setVerifications] = useState<Record<string, boolean>>({});

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
        setTeams(data.teams || []); // Hier worden de teams opgehaald, inclusief punten
      } catch (error: any) {
        console.error("Error fetching competition details:", error);
        setMessage(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitionDetails();
  }, [competitionId]);

  const processCompetition = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setMessage("You must be logged in to process the competition.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/process-competition`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ competitionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from backend:", errorData);
        throw new Error("Failed to process competition.");
      }

      const data = await response.json();
      console.log("Ranking data:", data.result?.ranking);

      if (data.result && data.result.ranking) {
        const sortedTeams = data.result.ranking.sort((a: any, b: any) => b.points - a.points); // Sort descending by points
        setTeams((prevTeams) =>
          prevTeams.map((team) => {
            const updatedTeam = sortedTeams.find((t: any) => t.team_id === team.team_id);
            return updatedTeam ? { ...team, points: updatedTeam.points } : team;
          })
        );
        setMessage("Competition processed successfully.");
      } else {
        console.warn("No ranking data found.");
        setMessage("No ranking data available.");
      }
    } catch (error: any) {
      console.error("Error processing competition:", error);
      setMessage(error.message || "An error occurred.");
    }
  };

  const handleLeaveCompetition = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setMessage("You must be logged in to leave the competition.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/leave-competition`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ competitionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to leave competition.");
      }

      const data = await response.json();
      setMessage(data.message || "Successfully left the competition.");
      setTeams((prevTeams) => prevTeams.filter((team) => team.team_id !== data.teamId));
    } catch (error: any) {
      console.error("Error leaving competition:", error);
      setMessage(error.message || "An error occurred.");
    }
  };

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
    return <div>Loading competition details...</div>;
  }

  return (
    <div>
      <h1>Competition Info</h1>
      {message && <p>{message}</p>}

      {competition && (
        <>
          <h2>{competition.name}</h2>
          <p>Game: {competition.game}</p>
          <p>Description: {competition.description}</p>
          <p>Start Date: {new Date(competition.start_date).toLocaleString()}</p>
          <p>End Date: {new Date(competition.end_date).toLocaleString()}</p>
          <p>Teams Joined: {competition.joined_teams} / {competition.max_teams}</p>
          <button onClick={handleLeaveCompetition} disabled={loading}>
            Leave Competition
          </button>
          <button onClick={processCompetition} disabled={loading}>
            Process Competition
          </button>
        </>
      )}

      {/* Top 3 Teams Section */}
      <h2>Top 3 Teams</h2>
      <ul>
        {teams
          .sort((a, b) => b.points - a.points) // Sort teams by points, descending
          .slice(0, 3) // Get top 3 teams
          .map((team) => (
            <li key={team.team_id}>
              <span>{team.team_name || "No Name Available"}</span>
              <span> - Points: {team.points || 0}</span>
            </li>
          ))}
      </ul>

      {/* All Teams Section */}
      <h2>All Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.team_id}>
            {team.team_name || "No Name Available"} - Points: {team.points || 0}
            <div>
              <button
                onClick={() => handleReportResult(team.team_id, 'win')}
                disabled={loading || verifications[team.team_id] === true}
              >
                Report Win
              </button>
              <button
                onClick={() => handleReportResult(team.team_id, 'loss')}
                disabled={loading || verifications[team.team_id] === false}
              >
                Report Loss
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
