import express from "express";
import { sendSuccess, sendError } from "./responseHelpers.js";
import errorHandler from "./errorHandler.js";

const app = express();
app.use(express.json());

// Routes...
app.get("/users", (req, res) => {
  const users = [{ id: 1, name: "Alice" }];
  sendSuccess(res, users, { page: 1, total: 1 });
});

app.get("/users/:id", (req, res) => {
  sendError(res, "NOT_FOUND", "User not found", [], 404);
});

app.use(errorHandler);

// Export app for testing
export default app;

// Only start server if this file is run directly
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log("Server running on port 3000"));
}
