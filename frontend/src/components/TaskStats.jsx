
import { useState } from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

function TaskStats({ tasks = [] }) {
  const [expanded, setExpanded] = useState(false);

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pending = tasks.length - completed;

  return (
    <div className="weekly-summary">

      <div
        className="stats-container"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <div className="stat-card completed-card">
          <div className="stat-icon">
            <Check size={14} />
          </div>

          <div className="stat-info">
            <span>Completed Tasks</span>
            <div className="stat-number">
              {completed}
              <small>This Week</small>
            </div>
          </div>
        </div>

        <div className="stat-card pending-card">
          <div className="stat-icon pending-icon">
            <X size={14} />
          </div>

          <div className="stat-info">
            <span>Open Tasks</span>
            <div className="stat-number">
              {pending}
              <small>This Week</small>
            </div>
          </div>
        </div>

        <div className="expand-indicator">
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {expanded && (
        <div className="weekly-task-list">
          <h4>All Tasks This Week ({tasks.length})</h4>

          {tasks.length === 0 ? (
            <p>No tasks scheduled for this week.</p>
          ) : (
            tasks.map((task) => (
              <div className="weekly-task-item" key={task._id}>
                <div>
                  <strong>{task.title}</strong>
                  <small>
                    {new Date(task.dateTime).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      }
                    )}
                  </small>
                </div>

                <span
                  className={
                    task.status === "completed"
                      ? "completed-label"
                      : "pending-label"
                  }
                >
                  {task.status === "completed"
                    ? "Completed"
                    : "Open"}
                </span>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

export default TaskStats;
