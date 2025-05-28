'use client'
import { useStaff } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useLogout";

export default function StaffManagement() {
  const {
    kitchenUsers,
    allUsers,
    loading,
    handleResetPassword,
    handleEditKitchenUser,
    handleChangePosIp,
    handleChangeKitchenIp,
    handleChangeBarIp,
    handleChangeAdditionPercentage,
    handleAddKitchenUser,
    handleAddAdmin,
    handleDeleteKitchenUser,
    handleDeleteAdmin,
  } = useStaff();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ip, setIp] = useState("");
  const [percentage, setPercentage] = useState("");

  const { logout, isPending } = useLogout();

  return (
    <div className="p-6 space-y-6">
      
      <Button onClick={() => logout()} disabled={isPending}>
            Logout
          </Button>

      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Button onClick={() => handleResetPassword(username, password, confirmPassword)}>Reset</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change IP Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="New IP" value={ip} onChange={(e) => setIp(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={() => handleChangePosIp(ip)}>Change POS IP</Button>
            <Button onClick={() => handleChangeKitchenIp(ip)}>Change Kitchen IP</Button>
            <Button onClick={() => handleChangeBarIp(ip)}>Change Bar IP</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Addition Percentage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Percentage" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
          <Button onClick={() => handleChangeAdditionPercentage(percentage)}>Update Percentage</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button onClick={handleAddKitchenUser}>Add Kitchen User</Button>
            <Button onClick={handleAddAdmin}>Add Admin</Button>
            <Button onClick={handleDeleteKitchenUser} variant="destructive">Delete Kitchen User</Button>
            <Button onClick={handleDeleteAdmin} variant="destructive">Delete Admin</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Kitchen Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : kitchenUsers.map((user, idx) => <p key={idx}>{user.username}</p>)}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : allUsers.map((user, idx) => <p key={idx}>{user.username}</p>)}
        </CardContent>
      </Card>
    </div>
  );
}