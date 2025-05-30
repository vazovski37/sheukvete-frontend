// src/features/sysadmin/components/RestaurantList.tsx
"use client";

import {
  useRestaurants,
  useCreateRestaurant,
  useDeleteRestaurant,
} from "../hooks/useRestaurants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Restaurant } from "../types";
import { useLogout } from "@/features/auth/hooks/useLogout"; // Import the logout hook
import { LogOut } from "lucide-react"; // Import a logout icon

export default function RestaurantList() {
  const { data, isLoading, isError } = useRestaurants();
  const createMutation = useCreateRestaurant();
  const deleteMutation = useDeleteRestaurant();
  const { logout, isPending: isLoggingOut } = useLogout(); // Destructure logout and its pending state

  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreate = () => {
    createMutation.mutate(
      {
        name: newName,
        password,
        confirmPassword,
      },
      {
        onSuccess: () => {
          setNewName("");
          setPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load restaurants.</p>;

  return (
    <div className="grid gap-6 max-w-2xl mx-auto mt-10 w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">System Admin Dashboard</h1>
        <Button onClick={() => logout()} disabled={isLoggingOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> {/* Logout icon */}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Restaurant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Restaurant Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="w-full"
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </CardContent>
      </Card>

      {data?.content?.map((r: Restaurant) => (
        <Card key={r.id}>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>
              {r.name}{" "}
              <span className="text-muted-foreground text-sm">({r.tenantCode})</span>
            </CardTitle>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(r.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}