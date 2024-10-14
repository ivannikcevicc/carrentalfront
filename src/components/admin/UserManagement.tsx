import React, { useState, useEffect, useCallback } from "react";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  createUser,
  fetchRoles,
  toggleBlockUser,
  assignRole,
  removeRole,
} from "@/lib/admin";
import { User, Role } from "@/lib/adminTypes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New state for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(roleFilter);

      const data = await fetchUsers(searchTerm, roleFilter);

      setUsers(data.data || []);
    } catch (error) {
      setError("Failed to load users. Please try again later.");
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, roleFilter]);

  const loadRoles = useCallback(async () => {
    try {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading roles:", error);
      setError("Failed to load roles. Some features may be limited.");
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [loadUsers, loadRoles]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
  };

  const openModal = (user: User | null) => {
    setSelectedUser(user);
    setIsNewUser(!user);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSelectedRoles(user.roles.map((role) => role.id));
      setPassword(""); // Reset password and confirm password
      setConfirmPassword("");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSelectedRoles([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleToggleBlock = async (user: User) => {
    try {
      await toggleBlockUser(user.id);
      await loadUsers();
    } catch (error) {
      console.error("Error toggling user block status:", error);
      setError("Failed to update user status. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isNewUser && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userData = {
        name,
        email,
        password,
        roles: selectedRoles.map((roleId) => ({
          id: roleId,
          name: roles.find((r) => r.id === roleId)?.name || "",
        })),
      };

      if (isNewUser) {
        await createUser(userData);
      } else if (selectedUser) {
        await updateUser(selectedUser.id, userData);
      }

      await loadUsers();
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Failed to save user. Please try again.");
    }
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (roleFilter === "" ||
          user.roles.some((role) => role.name === roleFilter))
    )
    .map((user) => (
      <TableRow key={user.id} className="hover:bg-gray-50 transition">
        <TableCell>
          <Link
            href={`/admin/users/details?id=${user.id}`}
            className="text-blue-600 hover:underline"
          >
            {user.name}
          </Link>
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          {user.roles.length ? (
            user.roles.map((role) => (
              <Badge key={role.id} className="mr-2" variant="secondary">
                {role.name}
              </Badge>
            ))
          ) : (
            <span className="text-gray-500">No roles assigned</span>
          )}
        </TableCell>
        <TableCell>
          {user.is_blocked ? (
            <span className="text-red-500">Blocked</span>
          ) : (
            <span className="text-green-500">Active</span>
          )}
        </TableCell>
        <TableCell className="space-x-2">
          <Button variant="ghost" onClick={() => openModal(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => handleDelete(user.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => handleToggleBlock(user)}>
            {user.is_blocked ? (
              <Unlock className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <Button onClick={() => openModal(null)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mb-4 flex space-x-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-xs"
            />
            <Select value={roleFilter} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={loadUsers}>Refresh</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{filteredUsers}</TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewUser ? "Add User" : "Edit User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                  required={isNewUser}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                  required={isNewUser}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label className="text-right">Roles</Label>
                <div className="col-span-3">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        className="text-black"
                        id={`role-${role.id}`}
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={(checked) => {
                          console.log(
                            `Role ID: ${role.id}, Checked: ${checked}`
                          );
                          handleRoleChange(role.id);
                        }}
                      />
                      <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isNewUser ? "Create" : "Update"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
