import { UserS } from "@/types/user";

// src/features/staff/types.ts
export interface StaffUser extends UserS {} // Alias or extension of global UserS

export interface ResetPasswordStaffRequest {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AddStaffUserPayload { // Example
    username: string;
    password?: string; // Depending on API
    role: 'KITCHEN' | 'ADMIN'; // Example
}