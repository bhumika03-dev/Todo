import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import Calendar from "../components/Calendar";
import TaskStats from "../components/TaskStats";
import WeeklyProgress from "../components/WeeklyProgress";
import TaskList from "../components/TaskList";

import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weekTasks, setWeekTasks] = useState([]);

  const [progress, setProgress] = useState(0);

  // Fetch today's tasks from backend
  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const today = new Date().toLocaleDateString("en-CA");

      const response = await fetch(
        `${API_URL}/dashboard?date=${selectedDate}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load tasks");
      }

      const dashboardData = result.data;
      setWeekTasks(dashboardData.weekTasks || []);

      setTasks(
        dashboardData.tasksToday.map((task) => ({
          ...task,
          id: task._id,
          completed: task.status === "completed",
        }))
      );

      setProgress(dashboardData.summary.progress);
    setWeekTasks(dashboardData.weekTasks || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  fetchTasks();

  const handleFocus = () => {
    fetchTasks();
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    window.removeEventListener("focus", handleFocus);
  };
}, []);

  // Update task completion in backend
  async function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    const newStatus = task.completed
      ? "pending"
      : "completed";

    try {
      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update task");
      }

      fetchTasks();

    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete task");
      }

      fetchTasks();

    } catch (error) {
      alert(error.message);
    }
  }

  function editTask(task) {
    console.log("Edit task:", task);
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );
 const [selectedDate, setSelectedDate] = useState(() => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
});
  return (
    <div className="home-page">
      <div className="home-dashboard">

        <SearchBar
          search={search}
          setSearch={setSearch}
        />
<Calendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
/>

        <TaskStats
  completed={completedTasks}
  pending={pendingTasks}
  tasks={weekTasks}
/>

        <WeeklyProgress
          progress={progress}
        />

        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        )}

        <button
          className="add-task-button"
          onClick={() => navigate("/new-task")}
          aria-label="Add new task"
        >
          <Plus size={28} />
        </button>

      </div>
    </div>
  );
}

export default Home;