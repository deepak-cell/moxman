type TokenRecord = {
  userId: string;
  role: string;
  email: string;
  name: string;
  branchId?: string | null;
  expiresAt: number;
  revokedAt?: number;
};

const store = new Map<string, TokenRecord>();

export function saveRefreshToken(hash: string, record: TokenRecord) {
  store.set(hash, record);
}

export function getRefreshToken(hash: string) {
  const record = store.get(hash);
  if (!record) return null;
  if (record.revokedAt) return null;
  if (record.expiresAt < Date.now()) return null;
  return record;
}

export function revokeRefreshToken(hash: string) {
  const record = store.get(hash);
  if (record) {
    record.revokedAt = Date.now();
    store.set(hash, record);
  }
}

export function revokeAll() {
  store.clear();
}
