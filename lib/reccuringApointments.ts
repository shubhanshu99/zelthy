import { Appointment } from "./types";

export const getAppointmentsByDayRange = (
  appointments: Appointment[],
  days: number
): Appointment[] => {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + days);

  const results: Appointment[] = [];

  appointments.forEach((apt) => {
    if (apt.status === "Cancelled") return;

    let currentOccurrence = new Date(apt.datetime);

    if (apt.repeat === "none") {
      if (currentOccurrence >= now && currentOccurrence <= endDate) {
        results.push(apt);
      }
      return;
    }
    while (currentOccurrence <= endDate) {
      if (currentOccurrence >= now) {
        results.push({
          ...apt,
          datetime: currentOccurrence.toISOString(),
        });
      }

      // Increment based on frequency
      switch (apt.repeat) {
        case "weekly":
          currentOccurrence.setDate(currentOccurrence.getDate() + 7);
          break;
        case "biweekly":
          currentOccurrence.setDate(currentOccurrence.getDate() + 14);
          break;
        case "monthly":
          currentOccurrence.setMonth(currentOccurrence.getMonth() + 1);
          break;
        case "quarterly":
          currentOccurrence.setMonth(currentOccurrence.getMonth() + 3);
          break;
        case "yearly":
          currentOccurrence.setFullYear(currentOccurrence.getFullYear() + 1);
          break;
        default:
          return;
      }
    }
  });

  return results.sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );
};

/**
 * Specific exported functions
 */

export const getNext7Days = (appointments: Appointment[]) => 
  getAppointmentsByDayRange(appointments, 7);

export const getNext14Days = (appointments: Appointment[]) => 
  getAppointmentsByDayRange(appointments, 14);

export const getNext30Days = (appointments: Appointment[]) => 
  getAppointmentsByDayRange(appointments, 30);

export const getNext90Days = (appointments: Appointment[]) => 
  getAppointmentsByDayRange(appointments, 90);