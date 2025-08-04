export function isMobileUserAgent(userAgent: string): boolean {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(userAgent);
}