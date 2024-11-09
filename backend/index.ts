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
// curl http://localhost:3000/api/tasks
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
// curl http://localhost:3000/api/epics
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

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing Prisma Client.");
  await prisma.$disconnect();
  process.exit(0);
});
