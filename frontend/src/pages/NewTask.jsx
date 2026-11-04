
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Clock,
  CalendarDays,
  X,
} from "lucide-react";

import "./NewTask.css";

function NewTask() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const title = formData.get("title");
  const date = formData.get("date");
  const startTime = formData.get("startTime");
  const description = formData.get("description");

  if (!date || !startTime) {
    alert("Please select a date and start time");
    return;
  }

  const dateTime = new Date(
    `${date}T${startTime}:00`
  ).toISOString();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dateTime,
          priority: "medium",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create task");
    }

    alert("Task created successfully!");
    navigate("/home");

  } catch (error) {
    console.error("Create task error:", error);
    alert(error.message || "Unable to create task");
  }
}

  return (
    <div className="new-task-page">

      <div className="new-task-container">

        {/* Header */}

        <div className="new-task-header">

          <button
            className="back-button"
            onClick={() => navigate("/home")}
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>

        </div>

        {/* Task Form */}

        <form
          className="new-task-form"
          onSubmit={handleSubmit}
        >

          {/* Task Title */}

          <div className="task-title-input">

            <input
              type="text"
              name="title"
              placeholder="Task title"
              required
            />

            <Search size={18} />

          </div>

          {/* Set Time */}

          <div className="new-task-field">

            <label>Set Time</label>

            <div className="new-task-time-row">

              <div className="new-task-input-icon">

                <Clock size={15} />

                <input
                  type="time"
                  name="startTime"
                  aria-label="Start time"
                />

              </div>

              <div className="new-task-input-icon">

                <Clock size={15} />

                <input
                  type="time"
                  name="endTime"
                  aria-label="End time"
                />

              </div>

            </div>

          </div>

          {/* Set Date */}

          <div className="new-task-field">

            <label>Set Date</label>

            <div className="new-task-input-icon">

              <input
                type="date"
                name="date"
                required
              />

              <CalendarDays size={16} />

            </div>

          </div>

          {/* Description */}

          <div className="new-task-field">

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Add Description"
              rows={5}
            />

          </div>

          {/* Create Task */}

          <button
            type="submit"
            className="create-task-button"
          >
            Create task
          </button>

        </form>

      </div>

    </div>
  );
}

export default NewTask;
