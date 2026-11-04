import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import "./TaskList.css";

const initialTasks = [
  { id: 1, title: "Finishing Wireframe", completed: false },
  { id: 2, title: "Meeting with team", completed: false },
  { id: 3, title: "Buy a cat food", completed: true },
];

export default function TaskList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="task-list-page">
      <header className="task-list-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="task-search">
        <input
          type="text"
          placeholder="Finish"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          autoFocus
        />
        <Search size={18} />
      </div>

      <section className="task-list">
        {filteredTasks.map((task) => (
          <label className="task-row" key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />

            <span className={task.completed ? "completed" : ""}>
              {task.title}
            </span>
          </label>
        ))}
      </section>
    </main>
  );
}
