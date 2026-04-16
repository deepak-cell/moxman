export type BranchRow = {
  id: string; // Branch code (ex: BR-01)
  name: string;
  city: string;
  state: string;
  status: "Active" | "Inactive";
  createdAt: string;
  addressLine: string;
  pincode: string;
};

export const mockBranches: BranchRow[] = [
  {
    id: "BR-01",
    name: "Mumbai Central",
    city: "Mumbai",
    state: "Maharashtra",
    status: "Active",
    createdAt: "12 Apr 2026",
    addressLine: "2nd Floor, Finance Plaza, Tardeo",
    pincode: "400034",
  },
  {
    id: "BR-02",
    name: "Delhi South",
    city: "Delhi",
    state: "Delhi",
    status: "Active",
    createdAt: "10 Apr 2026",
    addressLine: "B-17, Saket District Center",
    pincode: "110017",
  },
  {
    id: "BR-03",
    name: "Bengaluru North",
    city: "Bengaluru",
    state: "Karnataka",
    status: "Active",
    createdAt: "08 Apr 2026",
    addressLine: "4th Block, HBR Layout",
    pincode: "560043",
  },
  {
    id: "BR-04",
    name: "Pune Station",
    city: "Pune",
    state: "Maharashtra",
    status: "Inactive",
    createdAt: "05 Apr 2026",
    addressLine: "Shivaji Nagar, Near Railway Station",
    pincode: "411005",
  },
];

export const branchOptions = mockBranches.map((branch) => ({
  id: branch.id,
  name: branch.city,
}));
