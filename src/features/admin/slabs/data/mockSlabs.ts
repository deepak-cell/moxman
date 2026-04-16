export type Slab = {
  id: string;
  name: string; // "Slab 1", "Slab 2", etc.
  minClients: number; // minimum clients to qualify
  maxClients: number | null; // upper bound (exclusive), null = no cap
  payoutAmount: number; // in INR
  baseRatePerClient: number; // in INR
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const mockSlabs: Slab[] = [
  {
    id: "s1",
    name: "Slab 1",
    minClients: 10,
    maxClients: 12,
    payoutAmount: 7500,
    baseRatePerClient: 750,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "s2",
    name: "Slab 2",
    minClients: 12,
    maxClients: 20,
    payoutAmount: 9000,
    baseRatePerClient: 750,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "s3",
    name: "Slab 3",
    minClients: 20,
    maxClients: 30,
    payoutAmount: 17000,
    baseRatePerClient: 750,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "s4",
    name: "Slab 4",
    minClients: 30,
    maxClients: null,
    payoutAmount: 40000,
    baseRatePerClient: 750,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
];

export function resolveSlabForPartner(clientsJoinedToday: number, slabs: Slab[]): Slab | null {
  const sorted = [...slabs]
    .filter((slab) => slab.isActive)
    .sort((a, b) => b.minClients - a.minClients);

  return sorted.find((slab) => clientsJoinedToday >= slab.minClients) ?? null;
}

