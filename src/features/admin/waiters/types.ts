// src/features/admin/waiters/types.ts

// Represents a waiter as fetched for admin display
export interface Waiter {
  id: number;
  username: string;
  role: string; // Should ideally be "WAITER" or a more specific role
  active: boolean;
}

// Request type for adding a new waiter
export interface AddWaiterRequest {
  username: string;
  password: string;
  confirmPassword: string;
}

// Request type for editing a waiter's details (currently only username)
export interface EditWaiterRequest {
  username: string;
}