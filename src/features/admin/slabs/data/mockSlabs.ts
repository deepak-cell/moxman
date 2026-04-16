export const incentivePlanDefaults = {
  basePayPerClient: 750,
  incentiveBasePerClient: 5000,
  over200ClientsPercent: 40,
  over200ClientsThreshold: 200,
} as const;

export type IncentiveTier = {
  id: string;
  name: string; // Category / nomenclature ("Starter", "Pro", etc.)
  minClients: number; // minimum clients to qualify
  maxClients: number | null; // upper bound (exclusive), null = no cap
  commissionPercent: number; // percent of incentiveBasePerClient * clients
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export function calculateTierPayout(params: {
  clients: number;
  commissionPercent: number;
  basePayPerClient?: number;
  incentiveBasePerClient?: number;
}) {
  const basePayPerClient = params.basePayPerClient ?? incentivePlanDefaults.basePayPerClient;
  const incentiveBasePerClient =
    params.incentiveBasePerClient ?? incentivePlanDefaults.incentiveBasePerClient;

  const basePay = params.clients * basePayPerClient;
  const grossIncentiveBase = params.clients * incentiveBasePerClient;
  const totalPayout = (grossIncentiveBase * params.commissionPercent) / 100;
  const incentivePayout = Math.max(0, totalPayout - basePay);

  return { basePay, totalPayout, incentivePayout };
}

export const mockSlabs: IncentiveTier[] = [
  {
    id: "s1",
    name: "Starter",
    minClients: 1,
    maxClients: 30,
    commissionPercent: 15,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "s2",
    name: "Growth",
    minClients: 30,
    maxClients: 40,
    commissionPercent: 20,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "s3",
    name: "Pro",
    minClients: 40,
    maxClients: 100,
    commissionPercent: 23,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "s4",
    name: "Elite",
    minClients: 100,
    maxClients: 200,
    commissionPercent: 25,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "s5",
    name: "Champion",
    minClients: 200,
    maxClients: 201,
    commissionPercent: 28,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
  {
    id: "s6",
    name: "Legend",
    minClients: 201,
    maxClients: null,
    commissionPercent: 40,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
];

export function resolveSlabForPartner(
  clientsJoinedToday: number,
  slabs: IncentiveTier[]
): IncentiveTier | null {
  if (clientsJoinedToday > incentivePlanDefaults.over200ClientsThreshold) {
    const existing =
      slabs.find(
        (tier) => tier.isActive && tier.minClients > incentivePlanDefaults.over200ClientsThreshold
      ) ?? null;
    return (
      existing ?? {
        id: "over-200",
        name: "40% Tier",
        minClients: incentivePlanDefaults.over200ClientsThreshold + 1,
        maxClients: null,
        commissionPercent: incentivePlanDefaults.over200ClientsPercent,
        isActive: true,
        createdAt: "—",
        updatedAt: "—",
      }
    );
  }

  const sorted = [...slabs]
    .filter((tier) => tier.isActive)
    .sort((a, b) => b.minClients - a.minClients);

  return (
    sorted.find((tier) => {
      if (clientsJoinedToday < tier.minClients) return false;
      if (tier.maxClients == null) return true;
      return clientsJoinedToday < tier.maxClients;
    }) ?? null
  );
}
