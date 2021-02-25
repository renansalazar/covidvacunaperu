import { useLocale } from '../hooks/useLocale'

export const formatNumber = ({ locale, value }) => new Intl.NumberFormat(locale).format(value)

export default function FormatNumber ({ children }) {
  const { locale } = useLocale()
  return formatNumber({ locale, value: children })
}
