import { useTable, useSortBy } from "react-table";
import { useMemo } from "react";
import { useLocale } from '../hooks/useLocale.js'

import styles from '../styles/Table.module.css'
import { formatNumber } from './FormatNumber'
import { formatPercentage } from './FormatPercentage'

const indiceTotal = '25'

const Table = ({ data }) => {
  const { locale } = useLocale
  const dataTable = data
  /* const dataTable = useMemo(
    () =>
    
      data.map((element) => {
          const { porcentajePrimeraDosis, porcentajeSegundaDosis, ...rest } = element;
          return {
            porcentajePrimeraDosis: !isNaN(porcentajePrimeraDosis) ? porcentajePrimeraDosis.toFixed(4) : 0,
            porcentajeSegundaDosis: !isNaN(porcentajeSegundaDosis) ? porcentajeSegundaDosis.toFixed(4) : 0,
            ...rest
          };
        })
    ,
    [data]
  ); */

  const toNumber = value => formatNumber({ locale, value })
  const toPercentage = value => formatPercentage({ locale, value })

  const columns = useMemo(
    () => [
      {
        Header: "",
        id: "departamento",
        accessor: "departamento",
        format: (departamento) => departamento
      },
      {
        Header: "Primera Dosis",
        accessor: 'primeraDosis',
        format: toNumber
      },
      {
        Header: "% de Poblacion con 1ra Dosis",
        accessor: "porcentajePrimeraDosis",
        format: toPercentage
      },
      {
        Header: "Segunda Dosis",
        accessor: "segundaDosis",
        format: toNumber
      },
      {
        Header: "% de Poblacion con 2da Dosis",
        accessor: "porcentajeSegundaDosis",
        format: toPercentage
      }
    ],
    [data]
  );

  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: dataTable,
      initialState: {
        sortBy: [
          {
            id: "departamento",
            desc: false,
          },
        ],
      },
    },
    useSortBy
  );

  rows = [...rows.filter(row=>row.id!=='25'), ...rows.filter(row=>row.id=='25')]
  return (
    <div className={styles.container}>
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            rows.map((row, index)=>{
              prepareRow(row)
              const className = row.id === indiceTotal ? styles.totals : styles.row

              return (
                <tr {...row.getRowProps()} className={className} >
                  {
                    row.cells.map((cell, index)=>{
                      return (
                        <td className={styles.cell}>
                          <span key={index} className={index==0?styles.text:styles.number}>
                            {cell.column.format(cell.value)}
                          </span>
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default Table;
