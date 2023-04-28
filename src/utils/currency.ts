/**
 * formatCurrency - Formats a number to a currency string
 * @param {number} value - The number to format
 * @param {string} currency - The currency to use
 * @param {string} locale - The locale to use
 * @returns {string} - The formatted currency string
 * @example
 * formatCurrency(1234.56, 'USD', 'en-US') // $1,234.56
 * formatCurrency(1234.56, 'EUR', 'de-DE') // 1.234,56 €
 * formatCurrency(1234.56, 'JPY', 'ja-JP') // ¥1,235
 * formatCurrency(1234.56, 'GBP', 'en-GB') // £1,234.56
 * formatCurrency(1234.56, 'GBP', 'en-GB', { style: 'currency', currencyDisplay: 'code' }) // GBP1,234.56
 * // space between currency and value
 * formatCurrency(1234.56, 'GBP', 'en-GB', { style: 'currency', currencyDisplay: 'symbol', currencySpacing: { beforeCurrency: { spaceBetween: true } } }) // £ 1,234.56
 * // space after comma
 * formatCurrency(1234.56, 'GBP', 'en-GB', { style: 'currency', currencyDisplay: 'symbol', currencySpacing: { afterCurrency: { spaceBetween: true } } }) // £1,234. 56
 *
 */
export default function formatCurrency(
  value: number,
  currency: string,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options
  }).format(value)
}

/**
 * toDollars - Converts a number to a dollar string
 * @param {number} value - The number to convert
 *
 * @returns {string} - The dollar string
 */
export function toDollars(value: number): string {
  return formatCurrency(value, 'USD', 'en-US', {
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
}

/**
 * toGhanaCedis - Formats a number to a currency string in Ghana Cedis ₵
 * @param {number} value
 * @returns {string} - The formatted currency string
 */
export function toGhanaCedis(value: number): string {
  return formatCurrency(value, 'GHS', 'en-GH', {
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
}

/**
 * toEuro - Formats a number to a currency string in Euros €
 * @param {number} value
 * @returns {string} - The formatted currency string
 */
export function toEuro(value: number): string {
  return formatCurrency(value, 'EUR', 'de-DE', {
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
}

/**
 * toPounds - Formats a number to a currency string in Pounds £
 * @param {number} value
 *
 * @returns {string} - The formatted currency string
 */
export function toPounds(value: number): string {
  return formatCurrency(value, 'GBP', 'en-GB', {
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
}
