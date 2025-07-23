import { db, Task } from "astro:db";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Generate a unique ID for the task
    const taskData = {
      ...data,
      id: Date.now(), // Simple ID generation - in production you might want something more robust
      updatedAt: data.updatedAt || data.createdAt,
    };

    const result = await db.insert(Task).values([taskData]);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error adding task:", error);
    return new Response(JSON.stringify({ error: "Failed to add task" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
