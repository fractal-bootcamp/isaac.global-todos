import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        epic: true,
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// POST new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: "PENDING",
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error creating task" });
  }
});

// GET all epics
app.get("/api/epics", async (req, res) => {
  try {
    const epics = await prisma.epic.findMany({
      include: {
        tasks: true,
      },
    });
    res.json(epics);
  } catch (error) {
    res.status(500).json({ error: "Error fetching epics" });
  }
});

// POST new epic
app.post("/api/epics", async (req, res) => {
  try {
    const { title, description } = req.body;
    const epic = await prisma.epic.create({
      data: {
        title,
        description,
        status: "ACTIVE",
      },
    });
    res.json(epic);
  } catch (error) {
    res.status(500).json({ error: "Error creating epic" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
