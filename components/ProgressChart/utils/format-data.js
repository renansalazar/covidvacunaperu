import fs from 'fs'

/**
 * Take data files and process json for chart model type
 * Type: Array of { name: string, value: number }
 */
export default function formatChartData () {
    const mapValue = fs.readFileSync("public/data/histVacuna.json", { encoding: 'utf8' })
    let fechaCorte = fs.readFileSync("public/data/ultimoCorte.json", { encoding: 'utf8' })
    fechaCorte = JSON.parse(fechaCorte).fechaCorte
    let arrFechas = JSON.parse(mapValue)
    
    let dataset = {
        primeraDosisAdministradas:[],
        segundaDosisAdministradas:[]
    }
    const year = (s) => s.slice(0, 4)
    const month = (s) => s.slice(4, 6)
    const day = (s) => s.slice(6, 8)

    const matrixMap = (v) => [year(v), month(v), day(v)]
    arrFechas = arrFechas.sort((a, b) => {
        let aa = a.fechaVacunacion
        let bb = b.fechaVacunacion
        if(aa ===undefined){
            aa=fechaCorte
        }
        if(bb ===undefined){
            bb=fechaCorte
        }
        aa = matrixMap(aa).join("-")
        bb = matrixMap(bb).join("-")
        return new Date(aa).getTime() - new Date(bb).getTime()
    })

    let acumuladorPrimeraDosis = 0
    let acumuladorSegundaDosis = 0
    arrFechas.forEach(element=>{

        const primeraDosis = element.departamentos.find(({departamento})=>departamento==="TOTAL").primeraDosis
        acumuladorPrimeraDosis += primeraDosis
        const nombre = element.fechaVacunacion!==undefined?element.fechaVacunacion:fechaCorte
        let nombreFinal = matrixMap(nombre)
        let nameDataSet = [nombreFinal[2],nombreFinal[1],nombreFinal[0]].join("/")
        dataset.primeraDosisAdministradas.push({
            name: nameDataSet,
            value: acumuladorPrimeraDosis
        })

        const segundaDosis = element.departamentos.find(({departamento})=>departamento==="TOTAL").segundaDosis
        acumuladorSegundaDosis += segundaDosis
        dataset.segundaDosisAdministradas.push({
            name: nameDataSet,
            value: acumuladorSegundaDosis
        })

    })
    
    return dataset
}
