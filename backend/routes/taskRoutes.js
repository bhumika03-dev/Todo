import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

router.post("/tasks", async (req, res) => {
    try {
        const { title, description, dateTime, priority } = req.body;

        // Validate title
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        // Validate dateTime
        if (!dateTime || isNaN(Date.parse(dateTime))) {
            return res.status(400).json({
                success: false,
                message: "Valid date and time is required"
            });
        }

        // Create task
        const newTask = await Task.create({
            title: title.trim(),
            description,
            dateTime,
            priority
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

router.get("/tasks", async (req, res) => {
    try {
        const { date } = req.query;

        let filter = {};

        if (date) {
            const startDate = new Date(`${date}T00:00:00.000Z`);

            const endDate = new Date(startDate);
            endDate.setUTCDate(endDate.getUTCDate() + 1);

            filter.dateTime = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const tasks = await Task.find(filter);

        res.status(200).json({
            success: true,
            data: tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.patch("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Allow only specific fields
        const allowedFields = [
            "title",
            "description",
            "dateTime",
            "priority",
            "status"
        ];

        // 2. Build updates object
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        // 3. Check if valid fields exist
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided"
            });
        }

        // 4. Update task in MongoDB
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        // 5. Check if task exists
        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // 6. Send response
        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: deletedTask
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/tasks/search", async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || !keyword.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }

        const tasks = await Task.find({
            $or: [
                {
                    title: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


router.get("/dashboard", async (req, res) => {
    try {
        const selectedDate = req.query.date ||
            new Date().toISOString().slice(0, 10);

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD"
            });
        }

        const date = new Date(`${selectedDate}T00:00:00.000Z`);

        if (
            Number.isNaN(date.getTime()) ||
            date.toISOString().slice(0, 10) !== selectedDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid date"
            });
        }

        // Find Monday of selected week
        const monday = new Date(date);

        const day = monday.getUTCDay();

        monday.setUTCDate(
            monday.getUTCDate() - ((day + 6) % 7)
        );

        // Find Sunday (exclusive boundary is next Monday)
        const nextMonday = new Date(monday);

        nextMonday.setUTCDate(monday.getUTCDate() + 7);

        // Fetch all tasks belonging to selected week
        const weekTasks = await Task.find({
            dateTime: {
                $gte: monday,
                $lt: nextMonday
            }
        }).sort({ dateTime: 1 });

        // Calculate summary
        const completed = weekTasks.filter(
            task => task.status === "completed"
        ).length;

        const open = weekTasks.length - completed;

        const progress = weekTasks.length
            ? Number(((completed / weekTasks.length) * 100).toFixed(2))
            : 0;

        // Generate Monday-Sunday date strip
        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(monday);

            currentDay.setUTCDate(monday.getUTCDate() + i);

            const dayDate = currentDay.toISOString().slice(0, 10);

            const dayTasks = weekTasks.filter(
                task => task.dateTime.toISOString().slice(0, 10) === dayDate
            );

            weekDays.push({
                date: dayDate,
                day: currentDay.toLocaleDateString("en-US", {
                    weekday: "short",
                    timeZone: "UTC"
                }),
                taskCount: dayTasks.length
            });
        }

        // Fetch tasks for selected date
        const tasksToday = weekTasks.filter(
            task =>
                task.dateTime.toISOString().slice(0, 10) === selectedDate
        );

        res.status(200).json({
            success: true,
           data: {
    selectedDate,
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: new Date(
        nextMonday.getTime() - 86400000
    ).toISOString().slice(0, 10),

    summary: {
        completed,
        open,
        total: tasksToday.length,
        progress
    },

    weekDays,
    tasksToday,
    weekTasks
}
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;