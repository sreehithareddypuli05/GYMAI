type ClassValue = string | number | null | boolean | undefined | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const flat: string[] = []
  const walk = (v: ClassValue) => {
    if (!v) return
    if (Array.isArray(v)) return v.forEach(walk)
    flat.push(String(v))
  }
  inputs.forEach(walk)
  return flat.join(' ')
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
