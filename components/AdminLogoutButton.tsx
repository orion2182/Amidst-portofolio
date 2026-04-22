"use client";
import { logout } from "@/lib/actions";
import Button from "./Button";

export default function AdminLogoutButton() {
  return (
    <Button onClick={() => logout()} variant="outline" className="text-xs py-1 px-3">
      Logout
    </Button>
  );
}
