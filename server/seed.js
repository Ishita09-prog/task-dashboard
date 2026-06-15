import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Task from "./models/Task.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const email = "demo@taskflow.app";
  await Task.deleteMany({});
  await User.deleteOne({ email });

  const user = await User.create({
    name: "Demo User",
    email,
    password: "demo123",
  });

  const day = 86400000;
  const now = Date.now();

  const samples = [
    { title: "Design onboarding flow", description: "Wireframe the 3-step signup experience", status: "in-progress", priority: "high", assignee: "Ishita", dueDate: new Date(now + 2 * day) },
    { title: "Set up CI/CD pipeline", description: "GitHub Actions for test + deploy", status: "todo", priority: "medium", assignee: "Ravi", dueDate: new Date(now + 5 * day) },
    { title: "Fix mobile nav overlap", description: "Sidebar collides with content on small screens", status: "todo", priority: "high", assignee: "Ishita", dueDate: new Date(now - 1 * day) },
    { title: "Write API documentation", description: "Document all auth + task endpoints", status: "todo", priority: "low", assignee: "Maya", dueDate: new Date(now + 7 * day) },
    { title: "Integrate Recharts analytics", description: "Donut + bar charts on dashboard", status: "in-progress", priority: "medium", assignee: "Ravi", dueDate: new Date(now + 3 * day) },
    { title: "Add drag-and-drop to board", description: "dnd-kit Kanban columns", status: "done", priority: "high", assignee: "Ishita", dueDate: new Date(now - 2 * day) },
    { title: "Configure MongoDB Atlas", description: "Cluster + IP allowlist + user", status: "done", priority: "medium", assignee: "Maya", dueDate: new Date(now - 3 * day) },
    { title: "Polish glassmorphism cards", description: "Backdrop blur + subtle borders", status: "done", priority: "low", assignee: "Ishita", dueDate: new Date(now - 4 * day) },
  ];

  await Task.insertMany(
    samples.map((s, i) => ({ ...s, user: user._id, order: i }))
  );

  console.log("Seeded demo account:");
  console.log("  email:    demo@taskflow.app");
  console.log("  password: demo123");
  console.log(`  tasks:    ${samples.length}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
