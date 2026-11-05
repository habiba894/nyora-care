require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const Admin = require("./models/Admin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createOwner() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from backend/.env");
    }

    console.log("\n=== Nyora Beauty | Create Owner ===\n");

    const name = (await ask("Owner name: ")).trim();
    const email = (await ask("Owner email: ")).trim().toLowerCase();

    const password = await ask("Create a new password for the owner: ");

    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    if (password.length < 12) {
      throw new Error("Use a password with at least 12 characters.");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("\nConnected to MongoDB.");

    const existingAccount = await Admin.findOne({ email });

    if (existingAccount) {
      throw new Error(
        "This email already has an account. No account was changed.",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const owner = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "owner",
    });

    console.log("\nOwner account created successfully!");
    console.log("Name:", owner.name);
    console.log("Email:", owner.email);
    console.log("Role:", owner.role);
    console.log("\nThe password was stored as a hash.");
  } catch (error) {
    console.error("\nCould not create owner:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createOwner();
