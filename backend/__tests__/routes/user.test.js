const request = require("supertest");
const express = require("express");
const userRoutes = require("../../routes/user");
const User = require("../../models/userModel");
const db = require("../setup/db");

// Mock the token function
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("test-token"),
}));

// Create a simple express app for testing routes
const app = express();
app.use(express.json());
app.use("/api/user", userRoutes);

beforeAll(async () => {
  await db.connect();
  process.env.SECRET = "test-secret"; // Set JWT secret for tests
});

afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("User Routes", () => {
  describe("POST /api/user/signup", () => {
    it("should create a new user and return token", async () => {
      const userData = {
        firstName: "Route",
        lastName: "Test",
        email: "route@example.com",
        password: "StrongP@ssw0rd123",
      };

      const response = await request(app)
        .post("/api/user/signup")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("email", userData.email);
      expect(response.body).toHaveProperty("token");
    });

    it("should return error for invalid email", async () => {
      const userData = {
        firstName: "Route",
        lastName: "Test",
        email: "invalid-email",
        password: "StrongP@ssw0rd123",
      };

      const response = await request(app)
        .post("/api/user/signup")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toMatch(/Email is invalid/i);
    });
  });

  describe("POST /api/user/login", () => {
    it("should log in user and return token", async () => {
      // First create a user
      const userData = {
        firstName: "Login",
        lastName: "Route",
        email: "login-route@example.com",
        password: "StrongP@ssw0rd123",
      };

      // Create the user directly through the model
      await User.signup(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );

      // Then try to log in
      const loginData = {
        email: userData.email,
        password: userData.password,
      };

      const response = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(201);

      expect(response.body).toHaveProperty("email", userData.email);
      expect(response.body).toHaveProperty("token");
    });

    it("should return error for incorrect password", async () => {
      // First create a user
      const userData = {
        firstName: "Wrong",
        lastName: "Password",
        email: "wrong-pass@example.com",
        password: "StrongP@ssw0rd123",
      };

      // Create the user directly through the model
      await User.signup(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );

      // Try to log in with wrong password
      const loginData = {
        email: userData.email,
        password: "WrongPassword123",
      };

      const response = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toMatch(/Invalid password/i);
    });
  });
});
