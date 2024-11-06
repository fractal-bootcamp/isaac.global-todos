import Anthropic from "@anthropic-ai/sdk";
import { AIResponse, TaskStore, aiResponseSchema } from "./schemas";

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const createAIMessage = async (input: string) => {
  console.log("🚀 Sending request to Claude with input:", input);

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a task management assistant. Based on the user's request, generate a JSON response that follows this format:
                For tasks: { "type": "tasks", "data": { "tasks": [{ "title": "", "description": "" }] }}
                For epics: { "type": "epic", "data": { "epic": { "title": "", "description": "" }, "tasks": [] }}
                
                User request: ${input}`,
      },
    ],
  });

  console.log("📥 Raw response from Claude:", response.content);

  const content =
    response.content[0].type === "text"
      ? response.content[0].text
      : "Unsupported response type";

  console.log("📝 Extracted content:", content);

  const jsonMatch =
    content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No valid JSON found in response");
  }

  console.log("🔍 Matched JSON:", jsonMatch[1] || jsonMatch[0]);

  const jsonData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
  console.log("✅ Parsed and validated response:", jsonData);

  return aiResponseSchema.parse(jsonData);
};

export const handleAIResponse = async (
  response: AIResponse,
  taskStore: TaskStore
): Promise<string> => {
  console.log("⚙️ Processing AI response:", response);

  if (response.type === "tasks") {
    const { tasks } = response.data as {
      tasks: Array<{ title: string; description: string }>;
    };
    tasks.forEach((task) => taskStore.createTask(task.title, task.description));
    console.log("📋 Created tasks:", tasks);
    return `Created ${tasks.length} tasks successfully.`;
  }

  const { epic, tasks } = response.data as {
    epic: { title: string; description: string };
    tasks?: Array<{ title: string; description: string }>;
  };

  taskStore.createEpic(epic.title, epic.description);

  if (tasks && tasks.length > 0) {
    tasks.forEach((task) => {
      taskStore.createTask(task.title, task.description);
    });
  }

  console.log("📚 Created epic:", epic, "with tasks:", tasks);
  return `Created epic "${epic.title}" with ${
    tasks?.length || 0
  } associated tasks.`;
};
