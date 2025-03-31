import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { authenticator, createUserSession } from "../services/auth.server";
import { LoginForm } from "../components/auth/LoginForm";

export async function action({ request }) {
  try {
    const user = await authenticator.authenticate("form", request, {
      throwOnError: true,
    });
    return createUserSession(user.id, "/");
  } catch (error) {
    return json({ error: error.message });
  }
}

export default function Login() {
  const actionData = useActionData();
  return <LoginForm error={actionData?.error} />;
} 