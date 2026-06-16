/** Deterministic avatar URL per display name (DiceBear avataaars). */
export function avatarUrl(name: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`
}
