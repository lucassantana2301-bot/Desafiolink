import { DevicePerformance } from '@/types';

export function detectDevicePerformance(): DevicePerformance {
  if (typeof window === 'undefined') return 'high';

  // 1. Mobile Device Check
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  // 2. Hardware Concurrency (Logical Cores)
  const cores = navigator.hardwareConcurrency || 4;

  // 3. Device Memory (GB) - Chromium only
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;

  if (isMobile || cores <= 2 || memory <= 2) {
    return 'low';
  } else if (cores <= 4 || memory <= 4) {
    return 'medium';
  }

  return 'high';
}

export function checkPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
