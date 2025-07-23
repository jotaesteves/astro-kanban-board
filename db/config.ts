import { defineDb, defineTable, column } from "astro:db";

const Collaborators = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    email: column.text(),
    avatarUrl: column.text(),
  },
});

const KanbanBoard = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    boardName: column.text(),
    description: column.text(),
    createdBy: column.text(),
    createdAt: column.text(),
    updatedAt: column.text(),
    isPublic: column.boolean(),
  },
});

const Column = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    boardId: column.number({ references: () => KanbanBoard.columns.id }),
    title: column.text(),
    status: column.text(),
  },
});

const Task = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    columnId: column.number({ references: () => Column.columns.id }),
    boardId: column.number({ references: () => KanbanBoard.columns.id }),
    title: column.text(),
    status: column.text(),
    type: column.text(),
    description: column.text(),
    summary: column.text(),
    assigneeId: column.number({ references: () => Collaborators.columns.id }),
    assignee: column.text(),
    dueDate: column.text(),
    priority: column.text(),
    createdAt: column.text(),
    updatedAt: column.text(),
  },
});

const Label = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    color: column.text(),
  },
});

const Tag = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    color: column.text(),
    description: column.text(),
    createdAt: column.text(),
    updatedAt: column.text(),
  },
});

const Attachment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    taskId: column.number({ references: () => Task.columns.id }),
    fileName: column.text(),
    fileType: column.text(),
    fileSize: column.number(),
    url: column.text(),
    uploadedAt: column.text(),
    uploadedBy: column.text(),
    thumbnailUrl: column.text(),
    isPublic: column.boolean(),
    metadata: column.json(),
  },
});

const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    taskId: column.number({ references: () => Task.columns.id }),
    content: column.text(),
    author: column.text(),
    createdAt: column.text(),
    updatedAt: column.text(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Collaborators,
    KanbanBoard,
    Column,
    Task,
    Label,
    Tag,
    Attachment,
    Comment,
  },
});
