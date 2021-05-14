const download = require('download')
const fs = require('fs-extra')
const transformCsvToJsonVacunados = require('./transform-csv-to-json-vacunados')
const transformCsvToJsonPositivos = require('./transform-csv-to-json-positivos')
const transformCsvToJsonFallecidos = require('./transform-csv-to-json-fallecidos')

const URL_VACUNADOS = 'https://cloud.minsa.gob.pe/s/ZgXoXqK2KLjRLxD/download'

const URL_POSITIVOS = 'https://cloud.minsa.gob.pe/s/Y8w3wHsEdYQSZRp/download'
const URL_FALLECIDOS = 'https://cloud.minsa.gob.pe/s/Md37cjXmjT9qYSa/download'

const filenameVacunados = 'vacunas_covid.csv' //`${year}${month}${day}.xls`
const filenamePositivos = 'positivos_covid.csv' //`${year}${month}${day}.xls`
const filenameFallecidos = 'fallecidos_covid.csv' //`${year}${month}${day}.xls`

download(URL_VACUNADOS, 'public/data', { filenameVacunados })
.then(async () => {
    console.log(`${URL_VACUNADOS} downloaded`)
    const json = await transformCsvToJsonVacunados(filenameVacunados)
    if(json.jsonStatus.length>0){
      await fs.writeJson(`./public/data/latest.json`, json.jsonStatus)
      await fs.writeJson('./public/data/histVacuna.json', json.jsonHist)
      await fs.writeJson('./public/data/ultimoCorte.json', { fechaCorte: json.fechaCorte, rows: json.registros })
    }
    await fs.unlink('public/data/'+filenameVacunados, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
})
.catch(err => {
  console.error(`${URL_VACUNADOS} can't be downloaded. Error:`)
  console.error(err)
})

download(URL_POSITIVOS, 'public/data', { filenamePositivos })
.then(async () => {
  console.log(`${URL_POSITIVOS} downloaded`)
  const json = await transformCsvToJsonPositivos(filenamePositivos)
  if(json.jsonStatus.length>0){
    await fs.writeJson(`./public/data/latestPositivos.json`, json.jsonStatus)
    await fs.writeJson('./public/data/histPositivos.json', json.jsonHist)
  }
  await fs.unlink('public/data/'+filenamePositivos, function (err) {
      if (err) throw err;
      console.log('File deleted!');
  });
})
.catch(err => {
  console.error(`${URL_POSITIVOS} can't be downloaded. Error:`)
  console.error(err)
})

download(URL_FALLECIDOS, 'public/data', { filenameFallecidos })
.then(async () => {
    console.log(`${URL_FALLECIDOS} downloaded`)
    const json = await transformCsvToJsonFallecidos(filenameFallecidos)
    if(json.jsonStatus.length>0){
      await fs.writeJson(`./public/data/latestFallecidos.json`, json.jsonStatus)
      await fs.writeJson('./public/data/histFallecidos.json', json.jsonHist)
    }
    await fs.unlink('public/data/'+filenameFallecidos, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
})
.catch(err => {
  console.error(`${URL_FALLECIDOS} can't be downloaded. Error:`)
  console.error(err)
})