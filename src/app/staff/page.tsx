// src/app/staff/page.tsx
'use client';

// Make sure this path is correct for your new hook
import { useStaffManagement } from "@/features/staff/hooks/useStaffManagement"; 
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { 
  LogOut, 
  Loader2, 
  UserPlus, 
  Trash2, 
  Settings, 
  KeyRound, 
  Network, 
  PercentCircle, 
  Users, 
  Soup,
  UserCog // Icon for admin user
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Separator } from "@/components/ui/separator";
// UserS type might be used for display if needed, but primarily handled by the hook
// import type { UserS } from "@/types/user"; 

export default function StaffManagementPage() {
  const {
    kitchenUsers,
    allUsers,
    loading: isLoadingUsers, // True if either kitchenUsers or allUsers are loading
    
    resetPassword,
    isResettingPassword,

    // editKitchenUser, // Not used in the current UI, can be added if needed
    // isEditingKitchenUser,
    
    changePosIp,
    isChangingPosIp,
    changeKitchenIp,
    isChangingKitchenIp,
    changeBarIp,
    isChangingBarIp,

    changeAdditionPercentage,
    isChangingAdditionPercentage,

    addKitchenUser,
    isAddingKitchenUser,
    addAdmin,
    isAddingAdmin,

    deleteKitchenUser,
    isDeletingKitchenUser,
    deleteAdmin,
    isDeletingAdmin,
    
    refetchUsers, // To manually refetch user lists
  } = useStaffManagement();

  const [resetUsername, setResetUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [ipAddress, setIpAddress] = useState("");
  const [servicePercentage, setServicePercentage] = useState("");
  
  const { logout, isPending: isLoggingOut } = useLogout();

  const onResetPasswordSubmit = async () => {
    if (!resetUsername || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields for password reset.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      await resetPassword({ username: resetUsername, newPassword, confirmPassword: confirmNewPassword });
      // Success toast is handled by the hook
      setResetUsername("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      // Error toast is handled by the hook
    }
  };

  const onChangeIp = async (ipSetterFunction: (ip: string) => Promise<void>) => {
    if (!ipAddress.trim()) { 
      toast.error("IP address cannot be empty."); 
      return; 
    }
    await ipSetterFunction(ipAddress);
    // setIpAddress(""); // Optionally clear
  };

  const onChangeServicePercentage = async () => {
    if (!servicePercentage.trim()) { 
      toast.error("Percentage cannot be empty."); 
      return; 
    }
    const perc = parseFloat(servicePercentage);
    if (isNaN(perc) || perc < 0) { 
      toast.error("Invalid percentage value. Must be a non-negative number."); 
      return; 
    }
    await changeAdditionPercentage(servicePercentage);
  };
  
  // The addKitchenUser and addAdmin functions in the hook currently expect a payload (any).
  // If your backend API for adding these users doesn't require a specific payload from the frontend
  // (e.g., it creates users with default credentials), you can call them without arguments.
  // Otherwise, you'll need to gather necessary data (like username/password) for the payload.
  // For now, assuming no payload is needed from this UI based on original `useStaff`.
  const onAddKitchenUser = async () => {
    await addKitchenUser(undefined); // Pass undefined or {} if no payload is needed
    refetchUsers(); // Refetch user lists after adding
  };
  const onAddAdmin = async () => {
    await addAdmin(undefined); // Pass undefined or {} if no payload is needed
    refetchUsers(); // Refetch user lists after adding
  };
  
  // The deleteKitchenUser and deleteAdmin functions in the hook expect an optional username.
  // The current UI doesn't select a user to delete.
  // If these API calls delete a *specific* system user (e.g., the only kitchen user or a specific admin account),
  // then calling them without arguments is fine. Otherwise, you'd need UI to specify which user.
  const onDeleteKitchenUser = async () => {
    if(window.confirm("Are you sure you want to delete the KITCHEN user role/account? This action might be irreversible and could affect kitchen operations.")) {
        await deleteKitchenUser(undefined); // Pass username if API requires it for specific deletion
        refetchUsers();
    }
  };
  const onDeleteAdmin = async () => {
     if(window.confirm("Are you sure you want to delete the ADMIN user role/account? This action might be irreversible and could affect system administration capabilities.")) {
        await deleteAdmin(undefined); // Pass username if API requires it for specific deletion
        refetchUsers();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-primary flex items-center">
          <Settings className="mr-3 h-7 w-7" /> Staff & System Configuration
        </h1>
        <Button onClick={() => logout()} disabled={isLoggingOut} variant="outline" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {/* Section for Password Reset */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg"><KeyRound className="mr-2 h-5 w-5 text-primary"/>Reset User Password</CardTitle>
          <CardDescription>Update the password for any user account (Waiter, Admin, etc.).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="resetUsername">Username</Label>
            <Input id="resetUsername" placeholder="Enter username of the account" value={resetUsername} onChange={(e) => setResetUsername(e.target.value)} disabled={isResettingPassword}/>
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isResettingPassword}/>
          </div>
          <div>
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input id="confirmNewPassword" type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isResettingPassword}/>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onResetPasswordSubmit} disabled={isResettingPassword} className="w-full sm:w-auto">
            {isResettingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Reset Password
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg"><Network className="mr-2 h-5 w-5 text-primary"/>Network & Printer IPs</CardTitle>
            <CardDescription>Configure IP addresses for POS and printers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="ipAddress">IP Address to Set</Label>
              <Input id="ipAddress" placeholder="e.g., 192.168.1.100" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} disabled={isChangingPosIp || isChangingKitchenIp || isChangingBarIp}/>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-2">
              <Button onClick={() => onChangeIp(changePosIp)} disabled={isChangingPosIp || isChangingKitchenIp || isChangingBarIp} variant="outline" className="w-full">
                {(isChangingPosIp) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Set POS IP
              </Button>
              <Button onClick={() => onChangeIp(changeKitchenIp)} disabled={isChangingPosIp || isChangingKitchenIp || isChangingBarIp} variant="outline" className="w-full">
                {(isChangingKitchenIp) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Set Kitchen Printer IP
              </Button>
              <Button onClick={() => onChangeIp(changeBarIp)} disabled={isChangingPosIp || isChangingKitchenIp || isChangingBarIp} variant="outline" className="w-full">
                {(isChangingBarIp) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Set Bar Printer IP
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg"><PercentCircle className="mr-2 h-5 w-5 text-primary"/>Service Charge</CardTitle>
            <CardDescription>Set the additional service percentage applied to orders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="servicePercentage">Percentage (%)</Label>
              <Input id="servicePercentage" type="number" placeholder="e.g., 10 for 10%" value={servicePercentage} onChange={(e) => setServicePercentage(e.target.value)} disabled={isChangingAdditionPercentage}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={onChangeServicePercentage} disabled={isChangingAdditionPercentage} className="w-full">
              {isChangingAdditionPercentage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Percentage
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg"><UserCog className="mr-2 h-5 w-5 text-primary"/>Special User Role Management</CardTitle>
          <CardDescription>
            Create or remove predefined Kitchen and Admin user roles. These actions typically set up users with fixed credentials or system-defined roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={onAddKitchenUser} disabled={isAddingKitchenUser || isAddingAdmin || isDeletingKitchenUser || isDeletingAdmin}>
              {isAddingKitchenUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add KITCHEN User
          </Button>
          <Button onClick={onAddAdmin} disabled={isAddingKitchenUser || isAddingAdmin || isDeletingKitchenUser || isDeletingAdmin}>
              {isAddingAdmin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add ADMIN User
          </Button>
          <Button onClick={onDeleteKitchenUser} variant="destructive" disabled={isAddingKitchenUser || isAddingAdmin || isDeletingKitchenUser || isDeletingAdmin} className="mt-2">
               <Trash2 className="mr-2 h-4 w-4"/> {isDeletingKitchenUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete KITCHEN User
          </Button>
          <Button onClick={onDeleteAdmin} variant="destructive" disabled={isAddingKitchenUser || isAddingAdmin || isDeletingKitchenUser || isDeletingAdmin} className="mt-2">
               <Trash2 className="mr-2 h-4 w-4"/> {isDeletingAdmin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete ADMIN User
          </Button>
        </CardContent>
      </Card>
      
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg"><Soup className="mr-2 h-5 w-5 text-primary"/>Kitchen Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : kitchenUsers.length > 0 ? (
              <ul className="space-y-1 text-sm max-h-48 overflow-y-auto">
                {kitchenUsers.map((user, idx) => <li key={user.id || idx} className="p-2 border-b last:border-b-0">{user.username}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center p-4">No kitchen users found.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg"><Users className="mr-2 h-5 w-5 text-primary"/>All System Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : allUsers.length > 0 ? (
              <ul className="space-y-1 text-sm max-h-48 overflow-y-auto">
                {allUsers.map((user, idx) => <li key={user.id || idx} className="p-2 border-b last:border-b-0">{user.username} ({user.role})</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center p-4">No users found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}