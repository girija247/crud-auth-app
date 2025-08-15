import request from "supertest";
import app from "../server.js"; // adjust path if needed

describe("API Contract Tests", () => {
  it("should return success format", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("error", null);
  });

  it("should return error format", async () => {
    const res = await request(app).get("/users/999"); // non-existent
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("data", null);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toHaveProperty("code");
    expect(res.body.error).toHaveProperty("message");
  });
});
