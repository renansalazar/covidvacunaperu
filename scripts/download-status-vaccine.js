const download = require('download')
const fs = require('fs-extra')
const transformCsvToJson = require('./transform-csv-to-json')

const URL_DOWNLOAD = 'https://cloud.minsa.gob.pe/s/ZgXoXqK2KLjRLxD/download'


const url = `${URL_DOWNLOAD}`

const filename = 'vacunas_covid.csv' //`${year}${month}${day}.xls`

download(url, 'public/data', { filename })
.then(async () => {
    console.log(`${url} downloaded`)
    const json = await transformCsvToJson(filename)
    if(json.jsonStatus.length>0){
      await fs.writeJson(`./public/data/latest.json`, json.jsonStatus)
      await fs.writeJson('./public/data/hist_vacuna.json', json.jsonHist)
      await fs.writeJson('./public/data/ultimoCorte.json', { fechaCorte: json.fechaCorte, rows: json.registros })
    }
    await fs.unlink('public/data/'+filename, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
  })
  .catch(err => {
    console.error(`${url} can't be downloaded. Error:`)
    console.error(err)
  })
