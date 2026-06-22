/**
 * Currency utility functions for payment handling
 */

/**
 * Format amount in Indian Rupees
 * @param amount - Amount in rupees
 * @returns Formatted string with ₹ symbol
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert rupees to paise (for Razorpay)
 * @param amount - Amount in rupees
 * @returns Amount in paise (1 rupee = 100 paise)
 */
export function rupeesToPaise(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert paise to rupees (from Razorpay)
 * @param amount - Amount in paise
 * @returns Amount in rupees
 */
export function paiseToRupees(amount: number): number {
  return amount / 100;
}

/**
 * Validate amount for payment
 * @param amount - Amount to validate
 * @param minAmount - Minimum allowed amount (default: 1)
 * @param maxAmount - Maximum allowed amount (default: 1000000)
 * @returns Validation result
 */
export function validateAmount(
  amount: number,
  minAmount: number = 1,
  maxAmount: number = 1000000,
): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return { valid: false, error: "Amount is required" };
  }

  if (amount < minAmount) {
    return { valid: false, error: `Minimum amount is ${formatINR(minAmount)}` };
  }

  if (amount > maxAmount) {
    return { valid: false, error: `Maximum amount is ${formatINR(maxAmount)}` };
  }

  return { valid: true };
}
