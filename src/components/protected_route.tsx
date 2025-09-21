import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import type { ReactElement } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: ReactElement;
}) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/sign-in" />;
  }
  return children;
}