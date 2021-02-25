import { DefaultSeo } from 'next-seo'

import '../styles/globals.css'
import SEO from '../config/seo'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
