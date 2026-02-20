import { useMemo } from 'react';
import { CLINIC_INFO } from '@/constants';
import type { DayHours } from '@/types/clinic';

export interface UseClinicHoursReturn {
  today: string;
  hours: DayHours[];
  isToday: (day: string) => boolean;
  currentDayHours: DayHours | undefined;
  isCurrentlyOpen: boolean;
}

export function useClinicHours(): UseClinicHoursReturn {
  const today = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    []
  );

  const hours = CLINIC_INFO.hours;

  const isToday = (day: string): boolean => day === today;

  const currentDayHours = useMemo(
    () => hours.find((h) => h.day === today),
    [hours, today]
  );

  const isCurrentlyOpen = useMemo(() => {
    if (!currentDayHours?.isOpen) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const hoursMatch = currentDayHours.hours.match(
      /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
    );

    if (!hoursMatch) return false;

    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = hoursMatch;

    const parseTime = (hour: string, min: string, period: string): number => {
      let h = parseInt(hour, 10);
      const m = parseInt(min, 10);
      if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (period.toUpperCase() === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const openTime = parseTime(startHour, startMin, startPeriod);
    const closeTime = parseTime(endHour, endMin, endPeriod);

    return currentTime >= openTime && currentTime < closeTime;
  }, [currentDayHours]);

  return {
    today,
    hours,
    isToday,
    currentDayHours,
    isCurrentlyOpen,
  };
}
