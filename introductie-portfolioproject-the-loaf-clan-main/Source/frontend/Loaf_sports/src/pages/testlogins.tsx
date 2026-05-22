import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Competition {
  competition_id: number;
  name: string;
  game: string;
  start_date: string;
  end_date: string;
  is_joined: boolean; 
}

const JoinCompetitionPage = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch competitions
  const fetchCompetitions = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setErrorMessage("You must be logged in to view competitions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/competitions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCompetitions(data.competitions || []);
      } else {
        setErrorMessage(data.message || "Failed to fetch competitions.");
      }
    } catch (error) {
      console.error("Error fetching competitions:", error);
      setErrorMessage("An error occurred while fetching competitions.");
    }
  };

  // Join a competition
  const joinCompetition = async (competitionId: number) => {
    const token = Cookies.get("token");

    if (!token) {
      setErrorMessage("You must be logged in to join a competition.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/join-competition", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ competitionId }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message || "Successfully joined the competition!");
        // Update the competition list
        fetchCompetitions();
      } else {
        setErrorMessage(data.message || "Failed to join competition.");
      }
    } catch (error) {
      console.error("Error joining competition:", error);
      setErrorMessage("An error occurred while joining the competition.");
    }
  };

  // Fetch competitions when the component loads
  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div>
      <h1>Join a Competition</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <ul>
        {competitions.map((competition) => (
          <li key={competition.competition_id}>
            <p><strong>{competition.name}</strong></p>
            <p>Game: {competition.game}</p>
            <p>Start Date: {competition.start_date}</p>
            <p>End Date: {competition.end_date}</p>
            {competition.is_joined ? (
              <p style={{ color: "green" }}>Already joined</p>
            ) : (
              <button onClick={() => joinCompetition(competition.competition_id)}>
                Join
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JoinCompetitionPage;
