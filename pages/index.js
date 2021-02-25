import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Progress from '../components/Progress'
import MapPeru from '../components/MapPeru'
import Table from '../components/Table'
import FormatNumber from '../components/FormatNumber'
import FormatPercentage from '../components/FormatPercentage'

export default function Home({data}) {
  const totals = data.find(element=>element.departamento==='TOTAL')
  return (
    <div className={styles.container}>
      <Head>
        <title>Vacunación contra el COVID-19 en Perú</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Vacunación contra el COVID-19 en Perú
        </h1>

        <p className={styles.description}>
          Datos actualizados hace 4 dias. Fuente:
          {' '}
          <a href="https://www.datosabiertos.gob.pe/dataset/vacunaci%C3%B3n-contra-covid-19-ministerio-de-salud-minsa" target="__blank">Ministerio de Salud</a>
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Image className={styles.imageCardHeader} src="/vaccine.png" width={70} height={70} />
              <h3>Primera Dosis</h3>
            </div>
            <div className={styles.cardBody}>
              <p>
                <FormatNumber>
                  {totals.primeraDosis}
                </FormatNumber>
              </p>
            </div>
            <div>
                <small>
                  <Image className={styles.companyBrand} src="/logo_astrazeneca.jpeg" width={100} height={26} />
                  <span>
                    <FormatNumber>
                      {totals.astrazeneca}
                    </FormatNumber>
                  </span>
                </small>
                <small>
                  <Image className={styles.companyBrand} src="/logo_pfizer.png" width={80} height={30} />
                  <span>
                    <FormatNumber>
                      {totals.pfizer}
                    </FormatNumber>
                  </span>
                </small>
                <small>
                  <Image className={styles.companyBrand} src="/logo_sinopharm.png" width={80} height={30} />
                  <span>
                    <FormatNumber>
                      {totals.sinopharm}
                    </FormatNumber>
                  </span>
                </small>
            </div>
          </div>
         
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Image className={styles.imageCardHeader} src="/vaccineall.png" width={70} height={70} />
              <h3>Segunda Dosis</h3>
            </div>
            <div className={styles.cardBody}>
              <p>
                <FormatNumber>
                  {totals.segundaDosis}
                </FormatNumber>
              </p>
            </div>
            <div className={styles.cardBody}>
                <h4>
                  % sobre Primera Dosis
                </h4>
                <p>
                  <FormatPercentage>
                    {totals.porcentajeSegundaDosis}
                  </FormatPercentage>
                </p>
            </div>
          </div>
        </div>
        <Progress data={totals} />
        <div className={styles.links}>
          <a href="/data/latest.json" download >Descargar últimos datos en formato JSON</a>
        </div>
          <h2>Por Departamentos</h2>
        <MapPeru data={data} />
        <Table data={data}/>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/renansalazar"
          target="_blank"
        >
          Desarrollado por Renan Salazar
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps () {
  const data = require('../public/data/latest.json')

  return {
    props: {
      data
    }
  }
}
