// prisma/seed.ts

import { PrismaClient, EpicStatus, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

const sampleData = {
  tasks: [
    {
      id: "task-001",
      title: "Set up project infrastructure",
      description: "Initialize repository and set up basic project structure",
      status: "completed",
      epicId: "epic-001",
      createdAt: 1709561400000, // March 4, 2024
      updatedAt: 1709647800000,
    },
    {
      id: "task-002",
      title: "Design database schema",
      description: "Create initial database schema for core functionality",
      status: "completed",
      epicId: "epic-001",
      createdAt: 1709561400000,
      updatedAt: 1709647800000,
    },
    {
      id: "task-003",
      title: "Implement user authentication",
      description: "Set up JWT authentication and user sessions",
      status: "in_progress",
      epicId: "epic-001",
      createdAt: 1709647800000,
      updatedAt: 1709647800000,
    },
    {
      id: "task-004",
      title: "Create landing page design",
      description: "Design and implement main landing page",
      status: "pending",
      epicId: "epic-002",
      createdAt: 1709734200000,
      updatedAt: 1709734200000,
    },
    {
      id: "task-005",
      title: "Bug fix: Mobile responsiveness",
      description: "Fix layout issues on mobile devices",
      status: "pending",
      // No epicId - standalone task
      createdAt: 1709734200000,
      updatedAt: 1709734200000,
    },
    {
      id: "task-006",
      title: "Write documentation",
      description: "Create initial API documentation",
      status: "archived",
      epicId: "epic-001",
      createdAt: 1709474100000,
      updatedAt: 1709647800000,
    },
  ],
  epics: [
    {
      id: "epic-001",
      title: "Initial Project Setup",
      description: "Complete initial project setup and core infrastructure",
      status: "active",
      createdAt: 1709561400000,
      updatedAt: 1709647800000,
    },
    {
      id: "epic-002",
      title: "Frontend Development",
      description: "Implement core frontend features and designs",
      status: "active",
      createdAt: 1709647800000,
      updatedAt: 1709647800000,
    },
    {
      id: "epic-003",
      title: "User Management System",
      description: "Implement user management and authentication features",
      status: "completed",
      createdAt: 1709474100000,
      updatedAt: 1709647800000,
    },
  ],
};

async function main() {
  // Seed Epics
  for (const epicData of sampleData.epics) {
    await prisma.epic.upsert({
      where: { id: epicData.id },
      update: {},
      create: {
        id: epicData.id,
        title: epicData.title,
        description: epicData.description,
        status: epicData.status as EpicStatus,
        createdAt: new Date(epicData.createdAt),
        updatedAt: new Date(epicData.updatedAt),
      },
    });
  }

  // Seed Tasks
  for (const taskData of sampleData.tasks) {
    await prisma.task.upsert({
      where: { id: taskData.id },
      update: {},
      create: {
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status as TaskStatus,
        epicId: taskData.epicId || null,
        createdAt: new Date(taskData.createdAt),
        updatedAt: new Date(taskData.updatedAt),
      },
    });
  }
}

main()
  .then(async () => {
    console.log("Database seeded successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
