import { ClassValue } from 'clsx';
import { isWithinInterval, set } from 'date-fns';
import { cn } from '@/lib/utils';

export function isWithinTimeRange(from: number, to: number): boolean {
  const now = new Date();
  const start = set(now, { hours: from, minutes: 0, seconds: 0 });
  const end = set(now, { hours: to, minutes: 0, seconds: 0 });

  return isWithinInterval(now, { start, end });
}

export const cnWithBorder = (...inputs: ClassValue[]) => {
  return cn('border-[1px] border-black/[0.2] rounded-md bg-clip-padding', ...inputs);
}