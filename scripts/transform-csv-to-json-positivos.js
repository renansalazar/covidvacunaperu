const csvToJson = require("convert-csv-to-json");

module.exports = async function transformCsvToJson(csvFileName) {
  const json = csvToJson.fieldDelimiter(';').getJsonFromCsv(`./public/data/${csvFileName}`); //XLSX.utils.sheet_to_json(sheet)

  const jsonFormat = json.map((element) => {
    const {
      DEPARTAMENTO: departamento,
      FECHA_RESULTADO: fechaResultado,
    } = element;
    return {
      departamento:"LIMA REGION"?"LIMA":departamento,
    };
  });

  let jsonStatus = [];
  let jsonHist = [];

  
  jsonFormat.forEach((element) => {
    let objDepartamento = element.departamento;
    let objFechaResultado = element.fechaResultado;

    let indice = jsonStatus.findIndex(
    ({ departamento }) => departamento === objDepartamento
    );
    let indiceHist = jsonHist.findIndex(({ fechaResultado }) => fechaResultado === objFechaResultado);

    if (indice < 0) {
      jsonStatus.push({
          departamento: objDepartamento,
          cantidad: 1
      });
    } else {
      jsonStatus[indice].cantidad += 1;
    }

    if (indiceHist < 0) {
      jsonHist.push({
          fechaResultado: objFechaResultado,
          departamentos: [{ 
                          departamento: objDepartamento, 
                          cantidad: 1
                      }],
      });
    } else {
        let subIndiceHist = jsonHist[indiceHist].departamentos.findIndex(
            ({ departamento }) => departamento === objDepartamento
        );
        if (subIndiceHist < 0) {
            jsonHist[indiceHist].departamentos.push({
              departamento: objDepartamento,
              cantidad: 1
            });
        } else {
            jsonHist[indiceHist].departamentos[subIndiceHist].cantidad += 1;
        }
        }
    });

    let total = 0;
    jsonStatus.forEach((elemento, i) => {
        total += elemento.cantidad
    });
    jsonStatus.push({
      departamento: "TOTAL",
      cantidad: total
    });

    jsonHist.forEach((element, i) => {
      let total = element.departamentos.reduce((acc, cur) => {
        return acc + cur.cantidad;
      }, 0);
      jsonHist[i].departamentos.push({
        departamento: "TOTAL",
        cantidad: total
      });
    });
  return {
    jsonStatus,
    jsonHist
  };
};
