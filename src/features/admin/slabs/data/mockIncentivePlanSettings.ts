// features/admin/incentive-settings/data/mockIncentivePlanSettings.ts

export type IncentivePlanSettings = {
  id: string;
  basePayPerClient: number;         // ₹ guaranteed floor per client
  incentiveBasePerClient: number;   // ₹ gross revenue pool per client (commission % applied on this)
  over200ClientsThreshold: number;  // client count above which the high-volume rule kicks in
  over200ClientsPercent: number;    // fixed commission % for high-volume partners
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type IncentivePlanSettingsFormData = {
  id?: string;
  basePayPerClient: number;
  incentiveBasePerClient: number;
  over200ClientsThreshold: number;
  over200ClientsPercent: number;
  isActive: boolean;
};

/** Derived: the minimum commission % any tier can have (so incentivePayout never goes negative) */
export function deriveMinCommissionPercent(settings: Pick<IncentivePlanSettings, "basePayPerClient" | "incentiveBasePerClient">) {
  return (settings.basePayPerClient / settings.incentiveBasePerClient) * 100;
}

export const mockIncentivePlanSettings: IncentivePlanSettings[] = [
  {
    id: "plan-1",
    basePayPerClient: 750,
    incentiveBasePerClient: 5000,
    over200ClientsThreshold: 200,
    over200ClientsPercent: 40,
    isActive: true,
    createdAt: "05 Apr 2026",
    updatedAt: "16 Apr 2026",
  },
];
