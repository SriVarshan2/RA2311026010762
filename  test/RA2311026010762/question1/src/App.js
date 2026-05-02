import { useState, useEffect } from "react";

const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcml2YXJzaGFuc3JpZGhhcjVAZ21haWwuY29tIiwiZXhwIjoxNzc3NzAyMDcwLCJpYXQiOjE3Nzc3MDExNzAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyNTc5YjhjOC1kZTg3LTQ4YjgtYmI0Yi0xMjFmOWM0ZjA2NDMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzcml2YXJzaGFuIHNyaWRoYXIiLCJzdWIiOiJjNWFkODY1MS1kNmY3LTQwZTAtYWQ3Mi00ZDMyNzMxNmE0OWUifSwiZW1haWwiOiJzcml2YXJzaGFuc3JpZGhhcjVAZ21haWwuY29tIiwibmFtZSI6InNyaXZhcnNoYW4gc3JpZGhhciIsInJvbGxObyI6InJhMjMxMTAyNjAxMDc2MiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImM1YWQ4NjUxLWQ2ZjctNDBlMC1hZDcyLTRkMzI3MzE2YTQ5ZSIsImNsaWVudFNlY3JldCI6Ik1HaEtIRHZxc2FKR0dQWVkifQ.pnpmMxNfnNYUq-IgXlLGGOWhjLA-zCGH-hXCfexSl_c";

async function Log(stack, level, packageName, message) {
  const payload = { stack, level, package: packageName, message };
  try {
    const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": TOKEN
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log("[Logger] Log sent:", data);
  } catch (error) {
    console.error("[Logger] Failed:", error);
  }
}

function App() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    Log("frontend", "info", "component", "App component mounted");
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => {
        setData(data);
        Log("frontend", "info", "api", `Fetched ${data.length} users successfully`);
      })
      .catch(err => {
        Log("frontend", "error", "api", `Failed to fetch users: ${err.message}`);
      });
  }, []);

  const addItem = () => {
    if (!input) {
      Log("frontend", "warn", "component", "Add user attempted with empty input");
      return;
    }
    Log("frontend", "info", "api", `Adding new user: ${input}`);
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input })
    })
      .then(res => res.json())
      .then(newUser => {
        setData([...data, newUser]);
        setInput("");
        Log("frontend", "info", "component", `User added successfully: ${newUser.name}`);
      })
      .catch(err => {
        Log("frontend", "error", "api", `Failed to add user: ${err.message}`);
      });
  };

  return (
    <div>
      <h2>User List</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={addItem}>Add</button>
      {data.map((item, index) => (
        <p key={index}>{item.name}</p>
      ))}
    </div>
  );
}

export default App;