/**
 * Format number to Indonesian Rupiah currency format
 * Example: 25000 -> "Rp 25.000"
 */
export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return `${amount < 0 ? '- ' : ''}Rp ${formatted}`;
}

/**
 * Format plain number to id-ID decimal string without Rp
 * Example: 25000 -> "25.000"
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

/**
 * Format ISO date string (YYYY-MM-DD) to friendly Indonesian date
 * Example: "2026-11-11" -> "11 Nov 2026"
 */
export function formatDateID(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  return `${day} ${months[month - 1]} ${year}`;
}

/**
 * Format to Full Indonesian Month & Year
 * Example: "2026-11" -> "November 2026"
 */
export function formatMonthYear(yearMonthString: string): string {
  const [year, month] = yearMonthString.split('-').map(Number);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${months[month - 1]} ${year}`;
}

/**
 * Get today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current Year-Month as YYYY-MM
 */
export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

