import { db, Collaborators, KanbanBoard, Column, Task, Label, Tag, Comment } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(KanbanBoard).values([
    {
      boardName: "Demo Board",
      description: "A demo Kanban board for development.",
      createdBy: "Alice",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true,
    },
    {
      boardName: "Production Board",
      description: "A production Kanban board.",
      createdBy: "Jorge",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true,
    },
  ]);

  await db.insert(Column).values([
    { boardId: 1, title: "Backlog", status: "backlog" },
    { boardId: 1, title: "In Progress", status: "in-progress" },
    { boardId: 1, title: "Review", status: "review" },
    { boardId: 1, title: "Done", status: "done" },
    { boardId: 2, title: "2", status: "backlog" },
    { boardId: 2, title: "3", status: "in-progress" },
    { boardId: 2, title: "4", status: "review" },
    { boardId: 2, title: "5", status: "done" },
  ]);

  await db.insert(Collaborators).values([
    {
      name: "Alice",
      email: "alice@example.com",
      avatarUrl: "https://gravatar.com/avatar/acb72b2f0029dbad43bfcf24fa94a5e5?s=400&d=robohash&r=x",
    },
    {
      name: "Bob",
      email: "bob@example.com",
      avatarUrl: "https://gravatar.com/avatar/046dd605f0db4e59305e679d8d4308ae?s=400&d=robohash&r=x",
    },
    {
      name: "Charlie",
      email: "charlie@example.com",
      avatarUrl: "https://gravatar.com/avatar/8683ae730ec00f9828677f69b4980856?s=400&d=robohash&r=x",
    },
    {
      name: "Dave",
      email: "dave@example.com",
      avatarUrl: "https://gravatar.com/avatar/812e3962d69bd7dd2289245932586429?s=400&d=robohash&r=x",
    },
    {
      name: "Eve",
      email: "eve@example.com",
      avatarUrl: "https://gravatar.com/avatar/8bdb4d2ae52b4c2f7a39aff5427ead02?s=400&d=robohash&r=x",
    },
    {
      name: "Frank",
      email: "frank@example.com",
      avatarUrl: "https://gravatar.com/avatar/9786db5d61e85b77a7ae17fe4076689d?s=400&d=robohash&r=x",
    },
    { name: "Grace", email: "grace@example.com", avatarUrl: "" },
    { name: "Heidi", email: "heidi@example.com", avatarUrl: "" },
  ]);

  // Insert Demo Board Tasks (boardId: 1)
  await db.insert(Task).values([
    {
      columnId: 1,
      boardId: 1,
      title: "Setup project",
      status: "backlog",
      type: "task",
      description: "Initialize Astro Kanban project.",
      summary: "Project setup",
      assigneeId: 1, // Alice
      assignee: "Alice",
      dueDate: "",
      priority: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      columnId: 2,
      boardId: 1,
      title: "Implement drag and drop",
      status: "in-progress",
      type: "feature",
      description: "Add drag and drop for tasks and columns.",
      summary: "DnD feature",
      assigneeId: 2, // Bob
      assignee: "Bob",
      dueDate: "",
      priority: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      columnId: 3,
      boardId: 1,
      title: "Review code",
      status: "review",
      type: "improvement",
      description: "Code review for new features.",
      summary: "Review",
      assigneeId: 3, // Charlie
      assignee: "Charlie",
      dueDate: "",
      priority: "low",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      columnId: 4,
      boardId: 1,
      title: "Deploy to production",
      status: "done",
      type: "epic",
      description: "Deploy the Kanban board.",
      summary: "Deployment",
      assigneeId: 1, // Alice
      assignee: "Alice",
      dueDate: "",
      priority: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  // Insert Production Board Tasks (boardId: 2)
  await db.insert(Task).values([
    {
      columnId: 5,
      boardId: 2,
      title: "Setup production board",
      status: "backlog",
      type: "task",
      description: "Initialize production Kanban board.",
      summary: "Production setup",
      assigneeId: 4, // Dave
      assignee: "Dave",
      dueDate: "",
      priority: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      columnId: 6,
      boardId: 2,
      title: "Implement production features",
      status: "in-progress",
      type: "feature",
      description: "Add features specific to production board.",
      summary: "Production features",
      assigneeId: 5, // Eve
      assignee: "Eve",
      dueDate: "",
      priority: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      columnId: 7,
      boardId: 2,
      title: "Review production code",
      status: "review",
      type: "improvement",
      description: "Code review for production features.",
      summary: "Production Review",
      assigneeId: 6, // Frank
      assignee: "Frank",
      dueDate: "",
      priority: "low",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      columnId: 8,
      boardId: 2,
      title: "Deploy production board",
      status: "done",
      type: "epic",
      description: "Deploy the production Kanban board.",
      summary: "Production Deployment",
      assigneeId: 4, // Dave
      assignee: "Dave",
      dueDate: "",
      priority: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  await db.insert(Label).values([
    { name: "Bug", color: "red" },
    { name: "Feature", color: "blue" },
    { name: "Improvement", color: "green" },
    { name: "Epic", color: "purple" },
  ]);

  await db.insert(Tag).values([
    {
      name: "Frontend",
      color: "yellow",
      description: "Frontend tasks",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      name: "Backend",
      color: "orange",
      description: "Backend tasks",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      name: "Testing",
      color: "pink",
      description: "Testing tasks",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  await db.insert(Comment).values([
    {
      taskId: 1,
      author: "Alice",
      content: "This task is ready for review.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 2,
      author: "Bob",
      content: "Working on the drag and drop feature.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 3,
      author: "Charlie",
      content: "Code review completed.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 4,
      author: "Alice",
      content: "Deployment successful.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 5,
      author: "Dave",
      content: "Production board setup complete.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 6,
      author: "Eve",
      content: "Production features implemented.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
}
