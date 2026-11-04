import { useState } from "react";

import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onToggle,
  onDelete,
  onEdit,
}) {
  const [showAll, setShowAll] = useState(false);

  const displayedTasks = showAll
    ? tasks
    : tasks.slice(0, 4);

  return (
    <section className="tasks-section">

      {/* Section Header */}

      <div className="section-header">

        <h3>Tasks Today</h3>

        <button
          className="view-all"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "View Less" : "View All"}
        </button>

      </div>

      {/* Tasks */}

      <div className="task-list">

        {displayedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}

        {displayedTasks.length === 0 && (
          <p className="empty-message">
            No tasks found
          </p>
        )}

      </div>

    </section>
  );
}

export default TaskList;