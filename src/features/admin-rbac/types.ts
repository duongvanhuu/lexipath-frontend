export interface AdminPermission {
  id: string;
  key: string;
  label: string;
  group: string;
  desc: string;
}

export interface AdminRole {
  id: string;
  name: string;
  key: string;
  description: string;
  users: number;
  system: boolean;
  permissions: string[];
}

export interface RbacUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  lastActive: string;
}
