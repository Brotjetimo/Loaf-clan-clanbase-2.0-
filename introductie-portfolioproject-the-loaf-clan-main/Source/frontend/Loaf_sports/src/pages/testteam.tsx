import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Competition {
  competition_id: string;
  name: string;
  game: string;
  game_type: string;
  start_date: string;
  end_date: string;
  joined_teams: number;
  max_teams: number;
}

const CompetitionsList: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  // Fetch competitions
  useEffect(() => {
    const fetchCompetitions = async () => {
      const token = Cookies.get("token");

      if (!token) {
        setMessage("You must be logged in to view competitions.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/competitions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch competitions.");
        }

        const data = await response.json();
        setCompetitions(data.competitions || []);
      } catch (error: any) {
        console.error("Error fetching competitions:", error);
        setMessage(error.message || "An error occurred.");
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="competitions-list">
      <h1>Competitions</h1>
      {message && <p className="message">{message}</p>}

      <ul>
        {competitions.map((competition) => (
          <li key={competition.competition_id}>
            <button
              onClick={() => navigate(`/competition/${competition.competition_id}`)}
            >
              <h2>{competition.name} - {competition.game}</h2>
              <p>
                <strong>Game Type:</strong> {competition.game_type}
              </p>
              <p>
                <strong>Start Date:</strong> {new Date(competition.start_date).toLocaleDateString()} <br />
                <strong>End Date:</strong> {new Date(competition.end_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Teams Joined:</strong> {competition.joined_teams} / {competition.max_teams}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompetitionsList;
