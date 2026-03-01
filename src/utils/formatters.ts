import { Timestamp } from "firebase/firestore";

type FirestoreTimestamp = Timestamp | { seconds: number; nanoseconds: number };

const toDate = (value: FirestoreTimestamp | Date | number | null | undefined): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  if (value instanceof Timestamp) return value.toDate();
  if ("seconds" in value && "nanoseconds" in value) {
    return new Date(value.seconds * 1000 + Math.floor(value.nanoseconds / 1_000_000));
  }
  return null;
};

export const formatLastOnline = (
  value: FirestoreTimestamp | Date | number | null | undefined
): string => {
  const date = toDate(value);
  if (!date) return "Unknown";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 30_000) return "Just now";

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return `${diffSec}s ago`;
  if (diffHr < 1) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
};

export const isOnlineFromLastOnline = (
  value: FirestoreTimestamp | Date | number | null | undefined,
  thresholdSeconds = 30
): boolean => {
  const date = toDate(value);
  if (!date) return false;
  const diffMs = Date.now() - date.getTime();
  return diffMs <= thresholdSeconds * 1000;
};

export const formatBatteryPercentage = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) return "N/A";
  return `${Math.round(value)}%`;
};

