export const prerender = false;
import { db, Task } from "astro:db";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Prepare task data without manual ID (auto-increment will handle it)
    const taskData = {
      ...data,
      assigneeId: typeof data.assigneeId === "number" && data.assigneeId !== null ? data.assigneeId : 1,
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
