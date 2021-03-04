import { useState, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";

import { ProgressChart } from "../components/ProgressChart";
import Progress from "../components/Progress";
import Select from "../components/Select";
import MapPeru from "../components/MapPeru";
import TimeAgo from "../components/TimeAgo.jsx";
import Table from "../components/Table";
import FormatNumber from "../components/FormatNumber";
import FormatPercentage from "../components/FormatPercentage";
import formatChartData from "../components/ProgressChart/utils/format-data.js";
import {
  PrimeraDosisTooltip,
  SegundaDosisTooltip,
} from "../components/ProgressChart/tooltips";

export default function Home({ data, hist, info, departamentos }) {
  const [filter, setFilter] = useState("primeraDosis");
  const [search, setSearch] = useState("TOTAL");
  const totals = useMemo(
    () => data.find((element) => element.departamento === search),
    [search]
  );

  const dataFiltrada = useMemo(
    () =>
      filter === "primeraDosis"
        ? totals.porcentajePrimeraDosis
        : totals.porcentajeSegundaDosis,
    [filter, search]
  );

  const historico = useMemo(
    () => search === "TOTAL"
          ? hist[filter+"Administradas"]
          : hist[filter+"Departamentos"].map((d) => {
              return { name: d.name, value: d[search] };
            }),
    [filter, search]
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Vacunación contra el COVID-19 en Perú</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <a className={styles.buttonShare}
        target="__blank"
        href="https://twitter.com/intent/tweet?text=Progreso%20de%20la%20Vacunaci&#243;n%20COVID-19%20en%20Perú.%20https://covidvacunaperu.app">
        <span>Compartir</span>
        <svg class="u01-dtc-react__twitter-logo-icon twtr-icon" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" opacity="0"></path><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" fill="#1D9BF0"></path></svg>
      </a>

      <main className={styles.main}>
        <h1 className={styles.title}>Vacunación contra el COVID-19 en Perú</h1>

        <p className={styles.description}>
          Datos actualizados hace <TimeAgo timestamp={info.fechaCorte} />.
          Fuente:{" "}
          <a
            href="https://www.datosabiertos.gob.pe/dataset/vacunaci%C3%B3n-contra-covid-19-ministerio-de-salud-minsa"
            target="__blank"
          >
            Ministerio de Salud
          </a>
        </p>

        <Select data={departamentos} onChange={setSearch} />

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Image
                className={styles.imageCardHeader}
                src="/vaccine.png"
                width={60}
                height={60}
              />
              <h3>Primera Dosis</h3>
            </div>
            <div className={styles.cardBody}>
              <p>
                <FormatNumber>{totals.primeraDosis}</FormatNumber>
              </p>
            </div>
            <div>
              <small>
                <Image
                  className={styles.companyBrand}
                  src="/logo_astrazeneca.jpeg"
                  width={100}
                  height={26}
                />
                <span>
                  <FormatNumber>{totals.astrazeneca}</FormatNumber>
                </span>
              </small>
              <small>
                <Image
                  className={styles.companyBrand}
                  src="/logo_pfizer.png"
                  width={80}
                  height={30}
                />
                <span>
                  <FormatNumber>{totals.pfizer}</FormatNumber>
                </span>
              </small>
              <small>
                <Image
                  className={styles.companyBrand}
                  src="/logo_sinopharm.png"
                  width={80}
                  height={30}
                />
                <span>
                  <FormatNumber>{totals.sinopharm}</FormatNumber>
                </span>
              </small>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Image
                className={styles.imageCardHeader}
                src="/vaccineall.png"
                width={60}
                height={60}
              />
              <h3>Segunda Dosis</h3>
            </div>
            <div className={styles.cardBody}>
              <p>
                <FormatNumber>{totals.segundaDosis}</FormatNumber>
              </p>
            </div>
            <div className={styles.cardBody}>
              <h4>% sobre Primera Dosis</h4>
              <p>
                <FormatPercentage>
                  {totals.porcentajeSegundaDosis}
                </FormatPercentage>
              </p>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.groupRadio}>
              <label>
                <input
                  type="radio"
                  name="typeReport"
                  onChange={() => setFilter("primeraDosis")}
                  checked={filter === "primeraDosis"}
                />
                Primera Dosis
              </label>
              <label>
                <input
                  type="radio"
                  name="typeReport"
                  onChange={() => setFilter("segundaDosis")}
                  checked={filter === "segundaDosis"}
                />
                Segunda Dosis
              </label>
            </div>
            <Progress data={dataFiltrada} />
            <ProgressChart
              dataset={historico}
              tooltip={
                filter === "primeraDosis"
                  ? PrimeraDosisTooltip
                  : SegundaDosisTooltip
              }
            />
          </div>
        </div>

        <div className={styles.links}>
          <a href="/data/latest.json" download>
            Descargar últimos datos en formato JSON
          </a>
        </div>
        <h2>Por Departamentos</h2>
        <MapPeru data={data} />
        <Table data={data}/>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/renansalazar" target="_blank">
          Desarrollado por Renan Salazar
        </a>
        <span>•</span>
        <a
          href="https://github.com/renansalazar/covidvacunaperu"
          target="_blank"
        >
          Github
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const data = require("../public/data/latest.json");
  const info = require("../public/data/ultimoCorte.json");
  const hist = formatChartData();
  const departamentos = data.map((d) => d.departamento);

  return {
    props: {
      data,
      hist,
      info,
      departamentos,
    },
  };
}
