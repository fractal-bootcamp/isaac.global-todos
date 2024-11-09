const API_URL = import.meta.env.VITE_API_URL;

// Tasks
export async function fetchTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

export async function createTask(task: {
  title: string;
  description: string;
  status?: string;
  epicId?: string;
}) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...task,
      status: task.status || "pending",
    }),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

// Epics
export async function fetchEpics() {
  const response = await fetch(`${API_URL}/epics`);
  if (!response.ok) throw new Error("Failed to fetch epics");
  return response.json();
}

export async function createEpic(epic: {
  title: string;
  description: string;
  status?: string;
}) {
  const response = await fetch(`${API_URL}/epics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(epic),
  });
  if (!response.ok) throw new Error("Failed to create epic");
  return response.json();
}
