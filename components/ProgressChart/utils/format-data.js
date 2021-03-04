import fs from 'fs'

/**
 * Take data files and process json for chart model type
 * Type: Array of { name: string, value: number }
 */
export default function formatChartData () {
    const mapValue = fs.readFileSync("public/data/histVacuna.json", { encoding: 'utf8' })
    let fechaCorte = fs.readFileSync("public/data/ultimoCorte.json", { encoding: 'utf8' })
    let departamentos = fs.readFileSync("public/data/departamentos.json", { encoding: 'utf8' })
    fechaCorte = JSON.parse(fechaCorte).fechaCorte
    let arrFechas = JSON.parse(mapValue)
    let objDepartamentos = JSON.parse(departamentos).population
    delete objDepartamentos.TOTAL
    let arrNombreDepartamentos = Object.keys(objDepartamentos)
    arrNombreDepartamentos.forEach(element=>{
        objDepartamentos[element] = 0
    })

    let dataset = {
        primeraDosisDepartamentos:[],
        segundaDosisDepartamentos:[],
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
    let objPrimeraDosis = Object.assign({} , objDepartamentos)
    let objSegundaDosis = Object.assign({} , objDepartamentos)
    arrFechas.forEach(element=>{
        
        const nombre = element.fechaVacunacion!==undefined?element.fechaVacunacion:fechaCorte
        let nombreFinal = matrixMap(nombre)
        let nameDataSet = [nombreFinal[2],nombreFinal[1]].join("/")
        
        const primeraDosis = element.departamentos.find(({departamento})=>departamento==="TOTAL").primeraDosis
        acumuladorPrimeraDosis += primeraDosis
        dataset.primeraDosisAdministradas.push({
            name: nameDataSet,
            value: acumuladorPrimeraDosis
        })
        
        let objChartPrimeraDosis = { name: nameDataSet }
        let objChartSegundaDosis = { name: nameDataSet }
        arrNombreDepartamentos.forEach(el=>{
            const dosisDepartamento = element.departamentos.find(({departamento})=>departamento===el)
            if(dosisDepartamento!=undefined){
                objPrimeraDosis[el] += dosisDepartamento.primeraDosis
                objSegundaDosis[el] += dosisDepartamento.segundaDosis
            }
        })
        Object.assign(objChartPrimeraDosis, objPrimeraDosis)
        dataset.primeraDosisDepartamentos.push(objChartPrimeraDosis)
        
        Object.assign(objChartSegundaDosis, objSegundaDosis)
        dataset.segundaDosisDepartamentos.push(objChartSegundaDosis)

        const segundaDosis = element.departamentos.find(({departamento})=>departamento==="TOTAL").segundaDosis
        acumuladorSegundaDosis += segundaDosis
        dataset.segundaDosisAdministradas.push({
            name: nameDataSet,
            value: acumuladorSegundaDosis
        })

    })
    
    return dataset
}
