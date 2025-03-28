const User = require("../../models/userModel");
const mongoose = require("mongoose");
const db = require("../setup/db");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("User Model Tests", () => {
  it("should create a new user successfully", async () => {
    const userData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "StrongP@ssw0rd123",
    };

    const { firstName, lastName, email, password } = userData;
    const user = await User.signup(firstName, lastName, email, password);

    expect(user._id).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.firstName).toBe(firstName);
    expect(user.lastName).toBe(lastName);
    // Password should be hashed, not stored as plain text
    expect(user.password).not.toBe(password);
  });

  it("should throw error if email already exists", async () => {
    const userData = {
      firstName: "Test",
      lastName: "User",
      email: "duplicate@example.com",
      password: "StrongP@ssw0rd123",
    };

    const { firstName, lastName, email, password } = userData;
    await User.signup(firstName, lastName, email, password);

    // Try to create another user with the same email
    await expect(
      User.signup(firstName, lastName, email, password)
    ).rejects.toThrow("User already exists");
  });

  it("should login a user with correct credentials", async () => {
    const userData = {
      firstName: "Login",
      lastName: "Test",
      email: "login@example.com",
      password: "StrongP@ssw0rd123",
    };

    const { firstName, lastName, email, password } = userData;
    await User.signup(firstName, lastName, email, password);

    const user = await User.login(email, password);
    expect(user.email).toBe(email);
  });

  it("should throw error with incorrect password", async () => {
    const userData = {
      firstName: "Password",
      lastName: "Test",
      email: "password@example.com",
      password: "StrongP@ssw0rd123",
    };

    const { firstName, lastName, email, password } = userData;
    await User.signup(firstName, lastName, email, password);

    await expect(User.login(email, "wrongpassword")).rejects.toThrow(
      "Invalid password"
    );
  });
});
