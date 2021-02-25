import { useLocale } from '../hooks/useLocale'

const FRACTION_DIGITS = 2

export const formatPercentage = ({ locale, value }) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: FRACTION_DIGITS, minimumFractionDigits: FRACTION_DIGITS }).format(value)

export default function FormatPercentage ({ children }) {
  const { locale } = useLocale()
  return formatPercentage({ locale, value: children })
}
