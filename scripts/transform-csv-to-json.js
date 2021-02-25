const csvToJson = require("convert-csv-to-json");
const { population } = require("../public/data/departamentos.json");
const { rows } = require("../public/data/ultimoCorte.json");

module.exports = async function transformCsvToJson(csvFileName) {
  const json = csvToJson.fieldDelimiter(',').getJsonFromCsv(`./public/data/${csvFileName}`); //XLSX.utils.sheet_to_json(sheet)

  const jsonFormat = json.map((element) => {
    const {
      DEPARTAMENTO: departamento,
      DOSIS: dosis,
      FABRICANTE: fabricante,
      FECHA_VACUNACION: fechaVacunacion,
    } = element;
    return {
      departamento,
      dosis,
      fabricante,
      fechaVacunacion,
    };
  });

  let fechaCorte = json[0]["FECHA_CORTE"];
  let jsonStatus = [];
  let jsonHist = [];

  //Comprobacion por si se pierden registros en la descarga
  let registros = jsonFormat.length;
  if (registros >= rows) {
    const year = (s) => s.slice(0, 4);
    const month = (s) => s.slice(4, 6);
    const day = (s) => s.slice(6, 8);

    fechaCorte = +new Date(
      [year(fechaCorte), month(fechaCorte), day(fechaCorte)].join("-")
    );

    jsonFormat.forEach((element) => {
      let objDepartamento = element.departamento;
      let objFechaVacunacion = element.fechaVacunacion;
      let objDosis = element.dosis;
      let objFabricante = element.fabricante;

      let indice = jsonStatus.findIndex(
        ({ departamento }) => departamento === objDepartamento
      );
      let indiceHist = jsonHist.findIndex(
        ({ fechaVacunacion }) => fechaVacunacion === objFechaVacunacion
      );

      if (indice < 0) {
        jsonStatus.push({
          departamento: objDepartamento,
          primeraDosis: objDosis==="1" ? 1 : 0,
          segundaDosis: objDosis==="2" ? 1 : 0,
          sinopharm: objFabricante==="SINOPHARM" ? 1: 0,
          pfizer: objFabricante==="PFIZER" ? 1: 0,
          astrazeneca: objFabricante==="ASTRAZENECA" ? 1: 0
        });
      } else {
        if(objDosis==="1"){
            jsonStatus[indice].primeraDosis += 1;
        }else{
            jsonStatus[indice].segundaDosis += 1;
        }

        if(objFabricante==="SINOPHARM"){
            jsonStatus[indice].sinopharm += 1;
        }else if(objFabricante==="PFIZER"){
            jsonStatus[indice].pfizer += 1;
        }else if(objFabricante==="ASTRAZENECA"){
            jsonStatus[indice].astrazeneca += 1;
        }

      }

      if (indiceHist < 0) {
        jsonHist.push({
          fechaVacunacion: objFechaVacunacion,
          departamentos: [{ 
                            departamento: objDepartamento, 
                            primeraDosis: objDosis==="1" ? 1 : 0,
                            segundaDosis: objDosis==="2" ? 1 : 0
                        }],
        });
      } else {
        let subIndiceHist = jsonHist[indiceHist].departamentos.findIndex(
          ({ departamento }) => departamento === objDepartamento
        );
        if (subIndiceHist < 0) {
          jsonHist[indiceHist].departamentos.push({
            departamento: objDepartamento,
            primeraDosis: objDosis==="1" ? 1 : 0,
            segundaDosis: objDosis==="2" ? 1 : 0
          });
        } else {
          if(objDosis==="1"){
            jsonHist[indiceHist].departamentos[subIndiceHist].primeraDosis += 1;
          }else{
            jsonHist[indiceHist].departamentos[subIndiceHist].segundaDosis += 1
          }
        }
      }
    });

    let totalPrimeraDosis = 0;
    let totalSegundaDosis = 0;
    let totalSinopharm = 0;
    let totalPfizer = 0;
    let totalAstrazeneca = 0;
    jsonStatus.forEach((elemento, i) => {
        jsonStatus[i].porcentajePrimeraDosis =
            elemento.primeraDosis / population[elemento.departamento]
    
        jsonStatus[i].porcentajeSegundaDosis =
            elemento.segundaDosis / population[elemento.departamento]
        totalPrimeraDosis += elemento.primeraDosis
        totalSegundaDosis += elemento.segundaDosis
        totalSinopharm += elemento.sinopharm
        totalPfizer += elemento.pfizer
        totalAstrazeneca += elemento.astrazeneca
    });
    jsonStatus.push({
      departamento: "TOTAL",
      primeraDosis: totalPrimeraDosis,
      segundaDosis: totalSegundaDosis,
      sinopharm: totalSinopharm,
      pfizer: totalPfizer,
      astrazeneca: totalAstrazeneca,
      porcentajePrimeraDosis: totalPrimeraDosis / population["TOTAL"],
      porcentajeSegundaDosis: totalSegundaDosis / population["TOTAL"]
    });

    jsonHist.forEach((element, i) => {
      let totalPrimeraDosis = element.departamentos.reduce((acc, cur) => {
        return acc + cur.primeraDosis;
      }, 0);
      let totalSegundaDosis = element.departamentos.reduce((acc, cur) => {
        return acc + cur.segundaDosis;
      }, 0);
      jsonHist[i].departamentos.push({
        departamento: "TOTAL",
        primeraDosis: totalPrimeraDosis,
        segundaDosis: totalSegundaDosis
      });
    });
  }

  return {
    jsonStatus,
    jsonHist,
    fechaCorte,
    registros,
  };
};
