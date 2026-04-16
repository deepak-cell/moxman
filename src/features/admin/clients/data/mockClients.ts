export type ClientRow = {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailId: string;
  branch: string;
  partner: string;
  policy: string;
  status: "Pending" | "Active" | "Closed";
  createdAt: string;
};

export const mockClients: ClientRow[] = [
  {
    id: "CL-1001",
    fullName: "Riya Sharma",
    phoneNumber: "9876543210",
    emailId: "riya.sharma@example.com",
    branch: "Mumbai",
    partner: "Partner A",
    policy: "Health Secure Plus",
    status: "Pending",
    createdAt: "12 Apr 2026",
  },
  {
    id: "CL-1002",
    fullName: "Arjun Mehta",
    phoneNumber: "9123456780",
    emailId: "arjun.mehta@example.com",
    branch: "Delhi",
    partner: "Partner C",
    policy: "Car Protect Pro",
    status: "Active",
    createdAt: "10 Apr 2026",
  },
  {
    id: "CL-1003",
    fullName: "Meera Iyer",
    phoneNumber: "9988776655",
    emailId: "meera.iyer@example.com",
    branch: "Bengaluru",
    partner: "Partner B",
    policy: "Term Life Shield",
    status: "Active",
    createdAt: "08 Apr 2026",
  },
  {
    id: "CL-1004",
    fullName: "Rahul Singh",
    phoneNumber: "9090909090",
    emailId: "rahul.singh@example.com",
    branch: "Pune",
    partner: "Partner D",
    policy: "Health Secure Plus",
    status: "Closed",
    createdAt: "05 Apr 2026",
  },
];

export const partnerOptions = [
  { id: "PT-01", name: "Partner A" },
  { id: "PT-02", name: "Partner B" },
  { id: "PT-03", name: "Partner C" },
  { id: "PT-04", name: "Partner D" },
];

export const policyOptions = [
  { id: "PL-01", name: "Health Secure Plus" },
  { id: "PL-02", name: "Car Protect Pro" },
  { id: "PL-03", name: "Term Life Shield" },
];

