import { Prescription } from "./types";

export const getPrescriptionsByDayRange = (
  prescriptions: Prescription[],
  days: number
): Prescription[] => {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + days);

  const results: Prescription[] = [];

  prescriptions.forEach((rx) => {
    let currentRefill = new Date(rx.refill_on);

    // Loop to find all refills that fall within the window
    while (currentRefill <= endDate) {
      if (currentRefill >= now) {
        results.push({
          ...rx,
          refill_on: currentRefill.toISOString(),
        });
      }

      // Increment based on schedule
      switch (rx.refill_schedule) {
        case "weekly":
          currentRefill.setDate(currentRefill.getDate() + 7);
          break;
        case "monthly":
          currentRefill.setMonth(currentRefill.getMonth() + 1);
          break;
        case "quarterly":
          currentRefill.setMonth(currentRefill.getMonth() + 3);
          break;
        default:
          return; // Safety break
      }
      if (days <= 30 && results.some(r => r.id === rx.id)) break;
    }
  });

  return results.sort(
    (a, b) => new Date(a.refill_on).getTime() - new Date(b.refill_on).getTime()
  );
};

// Specific exports
export const getRefillsNext7Days = (rx: Prescription[]) => getPrescriptionsByDayRange(rx, 7);
export const getRefillsNext14Days = (rx: Prescription[]) => getPrescriptionsByDayRange(rx, 14);
export const getRefillsNext30Days = (rx: Prescription[]) => getPrescriptionsByDayRange(rx, 30);
export const getRefillsNext90Days = (rx: Prescription[]) => getPrescriptionsByDayRange(rx, 90);