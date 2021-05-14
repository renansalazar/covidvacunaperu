import { useState, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";

import { ProgressChart } from "../components/ProgressChart";
import Header from '../components/Header'
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
    [filter, search]
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
      <Header />
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
                src="/map.png"
                width={60}
                height={60}
              />
              <h3>Total de Dosis</h3>
            </div>
            <div className={styles.cardBody}>
              <p>
                <FormatNumber>{totals.primeraDosis+totals.segundaDosis}</FormatNumber>
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
            <div className={styles.cardBody}>
              <h4>% sobre total de dosis</h4>
              <p>
                <FormatPercentage>
                  {totals.primeraDosis/(totals.primeraDosis+totals.segundaDosis)}
                </FormatPercentage>
              </p>
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
              <h4>% sobre primera dosis</h4>
              <p>
                <FormatPercentage>
                  {totals.segundaDosis/totals.primeraDosis}
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
  console.log("aqui")
  const info = require("../public/data/ultimoCorte.json");
  const hist = formatChartData();
  const departamentos = data.map((d) => d.departamento);
  console.log("aqui tambien")
  console.log(departamentos)

  return {
    props: {
      data,
      hist,
      info,
      departamentos,
    },
  };
}
