export type PolicyRow = {
  id: string;
  policyName: string;
  policyType: "Health" | "Motor" | "Life";
  insurer: string;
  premium: string;
  commissionPercent: string;
  status: "Draft" | "Active" | "Inactive";
  updatedAt: string;
};

export const mockPolicies: PolicyRow[] = [
  {
    id: "POL-2001",
    policyName: "Health Secure Plus",
    policyType: "Health",
    insurer: "Moxman Insurance Co.",
    premium: "₹12,499",
    commissionPercent: "12%",
    status: "Active",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "POL-2002",
    policyName: "Car Protect Pro",
    policyType: "Motor",
    insurer: "Moxman Insurance Co.",
    premium: "₹8,750",
    commissionPercent: "10%",
    status: "Active",
    updatedAt: "14 Apr 2026",
  },
  {
    id: "POL-2003",
    policyName: "Term Life Shield",
    policyType: "Life",
    insurer: "Moxman Life",
    premium: "₹15,999",
    commissionPercent: "8%",
    status: "Inactive",
    updatedAt: "09 Apr 2026",
  },
];

