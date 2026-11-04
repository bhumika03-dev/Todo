import { Check, Trash2, Pencil } from "lucide-react";

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <div className="task-item">

      {/* Checkbox */}

      <button
        className={`task-checkbox ${
          task.completed ? "checked" : ""
        }`}
        onClick={() => onToggle(task.id)}
        aria-label="Toggle task completion"
      >
        {task.completed && <Check size={12} />}
      </button>

      {/* Task Title */}

      <span
        className={`task-title ${
          task.completed ? "completed" : ""
        }`}
      >
        {task.title}
      </span>

      {/* Actions */}

      <div className="task-actions">

        <button
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>

        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <Pencil size={16} />
        </button>

      </div>

    </div>
  );
}

export default TaskItem;