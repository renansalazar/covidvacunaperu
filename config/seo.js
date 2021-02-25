// global SEO config
const title = 'Progreso de la Vacunación COVID-19 en Perú'
const description =
  'Consulta el estado de la Vacunación COVID-19 de forma periódica según datos del gobierno.'

const SEO = {
  title,
  description,
  canonical: 'https://covidvacunaperu.app',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://covidvacunaperu.app',
    title,
    description,
    images: [
      {
        url: 'https://covidvacunaperu.app/og.png',
        alt: title,
        width: 400,
        height: 250
      }
    ]
  },
  twitter: {
    handle: '@renansalazar_js',
    site: '@renansalazar_js',
    cardType: 'summary_large_image'
  }
}

export default SEO
