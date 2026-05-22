import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Define the User type
interface User {
  id: string;
  username: string;
}

const Home = () => {
  const [users, setUsers] = useState<User[]>([]); // Set users state with the User[] type
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch available users
  const fetchUsers = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setErrorMessage("You must be logged in to see available users.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/available-users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data.users); // Update the users list
      } else {
        setErrorMessage(data.message || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Error connecting to the server.");
    }
  };

  // Add user to the team
  const addUserToTeam = async (userIdToAdd: string) => {
    setErrorMessage("");
    setSuccessMessage("");

    const token = Cookies.get("token");
    if (!token) {
      setErrorMessage("You must be logged in to add users to a team.");
      return;
    }

    console.log("Adding user with ID:", userIdToAdd);
    console.log("Authorization token:", token);

    try {
      const response = await fetch("http://localhost:3000/add-user-to-team", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIdToAdd }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("User added successfully:", data);
        setSuccessMessage(data.message || "User added to the team.");

        // Optimistically remove the user from the UI before refetching the list
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToAdd));

        // Fetch the updated list of users from the server
        fetchUsers();
      } else {
        console.error("Error adding user:", data.message);
        setErrorMessage(data.message || "Failed to add user to the team.");
      }
    } catch (error) {
      console.error("Error connecting to the server:", error);
      setErrorMessage("Error connecting to the server.");
    }
  };

  // Load available users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Available Users</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username}{" "}
            <button onClick={() => addUserToTeam(user.id)}>Add to Team</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home