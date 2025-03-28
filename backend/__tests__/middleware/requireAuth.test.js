const requireAuth = require("../../middleware/requireAuth");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const db = require("../setup/db");

// Mock jwt
jest.mock("jsonwebtoken");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("requireAuth Middleware", () => {
  it("should call next() if token is valid", async () => {
    // Create a user
    const user = await User.create({
      firstName: "Auth",
      lastName: "Test",
      email: "auth@example.com",
      password: "hashedpassword",
    });

    // Mock verify to return the user's ID
    jwt.verify.mockImplementation(() => ({ _id: user._id }));

    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };
    const res = {};
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user._id.toString()).toBe(user._id.toString());
  });

  it("should return 401 if no authorization header", async () => {
    const req = {
      headers: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "You must be logged in" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", async () => {
    // Mock verify to throw an error
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Request not authorized" });
    expect(next).not.toHaveBeenCalled();
  });
});
