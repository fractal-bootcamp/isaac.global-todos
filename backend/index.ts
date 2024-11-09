import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Get all tasks
// curl http://localhost:3000/api/tasks | jq
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        epic: true,
      },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Get all epics
// curl http://localhost:3000/api/epics | jq
app.get("/api/epics", async (req, res) => {
  try {
    const epics = await prisma.epic.findMany({
      include: {
        tasks: true,
      },
    });
    res.json(epics);
  } catch (error) {
    console.error("Error fetching epics:", error);
    res.status(500).json({ error: "Failed to fetch epics" });
  }
});

// Create a new task
// curl -X POST -H "Content-Type: application/json" -d '{"title":"New Task","description":"Task description","status":"pending"}' http://localhost:3000/api/tasks | jq
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, status, epicId } = req.body;
    const task = await prisma.task.create({
      data: {
        id: `task-${Date.now()}`, // Simple ID generation
        title,
        description,
        status,
        epicId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        epic: true,
      },
    });
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Create a new epic
// curl -X POST -H "Content-Type: application/json" -d '{"title":"New Epic","description":"Epic description","status":"active"}' http://localhost:3000/api/epics | jq
app.post("/api/epics", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const epic = await prisma.epic.create({
      data: {
        id: Math.random().toString(36).substring(2, 11),
        title,
        description,
        status: status || "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        tasks: true,
      },
    });
    res.json(epic);
  } catch (error) {
    console.error("Error creating epic:", error);
    res.status(500).json({ error: "Failed to create epic" });
  }
});
