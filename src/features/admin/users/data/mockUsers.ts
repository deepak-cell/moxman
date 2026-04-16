export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  branch: string;
  joined: string;
};

export const mockUsers: UserRow[] = [
  {
    id: "MOX03001",
    name: "Riya Sharma",
    email: "riya.sharma@moxman.local",
    role: "Partner",
    status: "Active",
    branch: "Mumbai",
    joined: "12 Mar 2026",
  },
  {
    id: "USR-002",
    name: "Arjun Mehta",
    email: "arjun.mehta@moxman.local",
    role: "Relationship Manager",
    status: "Active",
    branch: "Delhi",
    joined: "08 Feb 2026",
  },
  {
    id: "USR-003",
    name: "Meera Iyer",
    email: "meera.iyer@moxman.local",
    role: "Branch Manager",
    status: "Inactive",
    branch: "Bengaluru",
    joined: "21 Jan 2026",
  },
  {
    id: "USR-004",
    name: "Rahul Singh",
    email: "rahul.singh@moxman.local",
    role: "Sub Admin",
    status: "Active",
    branch: "Pune",
    joined: "02 Apr 2026",
  },
  {
    id: "MOX03002",
    name: "Anita Verma",
    email: "anita.verma@moxman.local",
    role: "Partner",
    status: "Active",
    branch: "Chennai",
    joined: "18 Mar 2026",
  },
  {
    id: "USR-006",
    name: "Karan Gupta",
    email: "karan.gupta@moxman.local",
    role: "Relationship Manager",
    status: "Inactive",
    branch: "Hyderabad",
    joined: "29 Jan 2026",
  },
  {
    id: "USR-007",
    name: "Neha Joshi",
    email: "neha.joshi@moxman.local",
    role: "Branch Manager",
    status: "Active",
    branch: "Kolkata",
    joined: "14 Feb 2026",
  },
  {
    id: "MOX03003",
    name: "Vikram Patel",
    email: "vikram.patel@moxman.local",
    role: "Partner",
    status: "Active",
    branch: "Ahmedabad",
    joined: "27 Mar 2026",
  },
  {
    id: "USR-009",
    name: "Sara Khan",
    email: "sara.khan@moxman.local",
    role: "Sub Admin",
    status: "Active",
    branch: "Jaipur",
    joined: "05 Apr 2026",
  },
  {
    id: "USR-010",
    name: "Dev Sharma",
    email: "dev.sharma@moxman.local",
    role: "Relationship Manager",
    status: "Active",
    branch: "Mumbai",
    joined: "30 Jan 2026",
  },
];
