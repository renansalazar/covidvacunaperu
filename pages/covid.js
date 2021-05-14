import {useState, useMemo} from 'react'
import Head from "next/head";
import Image from "next/image";

import CompareChart from "../components/CompareChart"
import Header from '../components/Header'
import styles from "../styles/Home.module.css";
import TimeAgo from "../components/TimeAgo.jsx";
import Select from "../components/Select";
import FormatNumber from "../components/FormatNumber";
import formatChartDataPositivos from "../components/ProgressChart/utils/format-data-covid.js";

export default ({dataVacunados, dataPositivos, histCovid, dataFallecidos, info, departamentos}) =>{
  const [search, setSearch] = useState("TOTAL");

  const totalsVacunados = useMemo(
    () => dataVacunados.find((element) => element.departamento === search),
    [search]
  );

  const totalsNuevosCasos = useMemo(
    () => histCovid.positivosCantidad[histCovid.positivosCantidad.length-1].value-histCovid.positivosCantidad[histCovid.positivosCantidad.length-2].value,
    [search]
  );

  const totalsNuevosFallecidos = useMemo(
    () => histCovid.fallecidosCantidad[histCovid.fallecidosCantidad.length-1].value-histCovid.fallecidosCantidad[histCovid.fallecidosCantidad.length-2].value,
    [search]
  );

  const totalsPositivos = useMemo(
    () => dataPositivos.find((element) => element.departamento === search),
    [search]
  );

  const totalsFallecidos = useMemo(
    () => dataFallecidos.find((element) => element.departamento === search),
    [search]
  );

  return (
        <div className={styles.container}>
            <Head>
                <title>Reportes sobre el Covid en Perú</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Reportes sobre el COVID-19 en Perú</h1>

                <p className={styles.description}>
                Datos actualizados hace <TimeAgo timestamp={info.fechaCorte} />.
                </p>

                <Select data={departamentos} onChange={setSearch} />

                <div className={styles.grid}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <Image
                        className={styles.imageCardHeader}
                        src="/map.png"
                        width={60}
                        height={60}
                      />
                      <h3>Contagiados</h3>
                    </div>
                    <div className={styles.cardBody}>
                      <p>
                        <FormatNumber>{totalsPositivos.cantidad}</FormatNumber>
                      </p>
                      <p className={styles.cardBody__subtitle}>
                        {'Últimos Contagiados: '}
                        <FormatNumber>{totalsNuevosCasos}</FormatNumber>
                      </p>
                      <h5>
                        Fuente: <a href="https://www.datosabiertos.gob.pe/dataset/casos-positivos-por-covid-19-ministerio-de-salud-minsa" target="__blank">Ministerio de Salud</a>
                      </h5>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <Image
                        className={styles.imageCardHeader}
                        src="/map.png"
                        width={60}
                        height={60}
                      />
                      <h3>Fallecidos</h3>
                    </div>
                    <div className={styles.cardBody}>
                      <p>
                        <FormatNumber>{totalsFallecidos.cantidad}</FormatNumber>
                      </p>
                      <p className={styles.cardBody__subtitle}>
                        {'Últimos Fallecidos: '}
                        <FormatNumber>{totalsNuevosFallecidos}</FormatNumber>
                      </p>                      
                      <h5>
                        Fuente: <a href="https://www.datosabiertos.gob.pe/dataset/fallecidos-por-covid-19-ministerio-de-salud-minsa" target="__blank">Ministerio de Salud</a>
                      </h5>
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                    <Image
                      className={styles.imageCardHeader}
                      src="/map.png"
                      width={60}
                      height={60}
                    />
                      <h3>Vacunación</h3>
                    </div>
                    <div className={styles.cardBody}>
                      <p>
                        <FormatNumber>{totalsVacunados.primeraDosis+totalsVacunados.segundaDosis}</FormatNumber>
                      </p>
                      <p className={styles.cardBody__subtitle}>
                        <Image
                          className={styles.imageCardHeader}
                          src="/vaccine.png"
                          width={40}
                          height={40}
                        />
                        <FormatNumber>{totalsVacunados.primeraDosis}</FormatNumber>
                      </p>
                      <p className={styles.cardBody__subtitle}>
                        <Image
                          className={styles.imageCardHeader}
                          src="/vaccineall.png"
                          width={40}
                          height={40}
                        />
                        <FormatNumber>{totalsVacunados.segundaDosis}</FormatNumber>
                      </p>
                      <h5>
                        Fuente: <a href="https://www.datosabiertos.gob.pe/dataset/vacunaci%C3%B3n-contra-covid-19-ministerio-de-salud-minsa" target="__blank">Ministerio de Salud</a>
                      </h5>
                    </div>
                  </div>
                  
                </div>
            </main>
        </div>
    )
}

export async function getStaticProps() {
    const dataVacunados = require("../public/data/latest.json");
    const dataPositivos = require("../public/data/latestPositivos.json");
    const dataFallecidos = require("../public/data/latestFallecidos.json");
    const info = require("../public/data/ultimoCorte.json");
    //const hist = formatChartData();
    const histCovid = formatChartDataPositivos();
    const departamentos = dataPositivos.map((d) => d.departamento);
  
    return {
      props: {
        dataVacunados,
        dataPositivos,
        dataFallecidos,
        //hist,
        histCovid,
        info,
        departamentos,
      },
    };
  }
  