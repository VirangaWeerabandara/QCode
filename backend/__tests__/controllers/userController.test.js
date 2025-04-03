const { loginUser, signupUser } = require("../../controllers/userController");
const User = require("../../models/userModel");
const db = require("../setup/db");

// Mock jwt
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("test-token"),
}));

// Mock the response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("User Controller Tests", () => {
  beforeEach(() => {
    process.env.SECRET = "test-secret";
  });

  describe("signupUser", () => {
    it("should create a new user and return token", async () => {
      const req = {
        body: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          password: "StrongP@ssw0rd123",
        },
      };
      const res = mockResponse();

      await signupUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        email: "test@example.com",
        token: "test-token",
      });
    });

    it("should return 400 if user already exists", async () => {
      // Create a user first
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "existing@example.com",
        password: "StrongP@ssw0rd123",
      };
      await User.signup(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );

      const req = {
        body: userData,
      };
      const res = mockResponse();

      await signupUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "User already exists",
      });
    });
  });

  describe("loginUser", () => {
    it("should login user and return token", async () => {
      // Create a user first
      const userData = {
        firstName: "Login",
        lastName: "Test",
        email: "login@example.com",
        password: "StrongP@ssw0rd123",
      };
      await User.signup(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );

      const req = {
        body: {
          email: userData.email,
          password: userData.password,
        },
      };
      const res = mockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if credentials are invalid", async () => {
      const req = {
        body: {
          email: "nonexistent@example.com",
          password: "wrongpassword",
        },
      };
      const res = mockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "User does not exist",
      });
    });
  });
});
