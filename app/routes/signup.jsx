import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { db } from "../lib/db.server";
import { createUserSession } from "../services/auth.server";
import { SignupForm } from "../components/auth/SignupForm";

export async function action({ request }) {
  const form = await request.formData();
  const name = form.get("name");
  const email = form.get("email");
  const password = form.get("password");

  // Validate the form data
  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  if (!name || !email || !password) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return json({ error: "A user with this email already exists" }, { status: 400 });
    }

    // Create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Create a subscription for the user (free plan)
    await db.subscription.create({
      data: {
        userId: user.id,
        plan: "FREE",
        activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Log the user in
    return createUserSession(user.id, "/");
  } catch (error) {
    console.error("Error creating user:", error);
    return json({ error: "Error creating user. Please try again." }, { status: 500 });
  }
}

export default function Signup() {
  const actionData = useActionData();
  return <SignupForm error={actionData?.error} />;
} 