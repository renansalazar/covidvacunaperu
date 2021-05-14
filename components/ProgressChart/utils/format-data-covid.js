import fs from 'fs'

/**
 * Take data files and process json for chart model type
 * Type: Array of { name: string, value: number }
 */
export default function formatChartData () {
    const mapValue = fs.readFileSync("public/data/histPositivos.json", { encoding: 'utf8' })
    const mapValueFallecidos = fs.readFileSync("public/data/histFallecidos.json", { encoding: 'utf8' })
    let fechaCorte = fs.readFileSync("public/data/ultimoCorte.json", { encoding: 'utf8' })
    let departamentos = fs.readFileSync("public/data/departamentos.json", { encoding: 'utf8' })
    fechaCorte = JSON.parse(fechaCorte).fechaCorte
    let arrFechas = JSON.parse(mapValue)
    let arrFechasFallecidos = JSON.parse(mapValueFallecidos)
    let objDepartamentos = JSON.parse(departamentos).population
    delete objDepartamentos.TOTAL
    let arrNombreDepartamentos = Object.keys(objDepartamentos)
    arrNombreDepartamentos.forEach(element=>{
        objDepartamentos[element] = 0
    })

    let dataset = {
        positivosDepartamentos:[],
        positivosCantidad:[],
        fallecidosDepartamentos:[],
        fallecidosCantidad:[]
    }
    const year = (s) => s.slice(0, 4)
    const month = (s) => s.slice(4, 6)
    const day = (s) => s.slice(6, 8)

    const matrixMap = (v) => [year(v), month(v), day(v)]
    arrFechas = arrFechas.sort((a, b) => {
        let aa = a.fechaResultado
        let bb = b.fechaResultado
        if(aa ===undefined){
            aa=fechaCorte
        }
        if(bb ===undefined){
            bb=fechaCorte
        }
        console.log("vuelves")
        console.log(aa)
        console.log(bb)
        aa = matrixMap(aa).join("-")
        bb = matrixMap(bb).join("-")
        return new Date(aa).getTime() - new Date(bb).getTime()
    })

    let acumuladorCantidad = 0
    let objPositivosCantidad = Object.assign({} , objDepartamentos)
    arrFechas.forEach(element=>{
        
        const nombre = element.fechaResultado!==undefined?element.fechaResultado:fechaCorte
        let nombreFinal = matrixMap(nombre)
        let nameDataSet = [nombreFinal[2],nombreFinal[1]].join("/")
        
        const cantidad = element.departamentos.find(({departamento})=>departamento==="TOTAL").cantidad
        acumuladorCantidad += cantidad
        dataset.positivosCantidad.push({
            name: nameDataSet,
            value: acumuladorCantidad
        })
        
        let objChartPositivosCantidad = { name: nameDataSet }
        arrNombreDepartamentos.forEach(el=>{
            const positivosDepartamento = element.departamentos.find(({departamento})=>departamento===el)
            if(positivosDepartamento!=undefined){
                objPositivosCantidad[el] += positivosDepartamento.cantidad
            }
        })
        Object.assign(objChartPositivosCantidad, objPositivosCantidad)
        dataset.positivosDepartamentos.push(objChartPositivosCantidad)

    })

    let acumuladorFallecidosCantidad = 0
    let objFallecidosCantidad = Object.assign({} , objDepartamentos)
    arrFechasFallecidos.forEach(element=>{

        const nombre = element.fechaFallecimiento!==undefined?element.fechaFallecimiento:fechaCorte
        let nombreFinal = matrixMap(nombre)
        let nameDataSet = [nombreFinal[2],nombreFinal[1]].join("/")
        
        const cantidad = element.departamentos.find(({departamento})=>departamento==="TOTAL").cantidad
        acumuladorFallecidosCantidad += cantidad
        dataset.fallecidosCantidad.push({
            name: nameDataSet,
            value: acumuladorFallecidosCantidad
        })
        
        let objChartFallecidosCantidad = { name: nameDataSet }
        arrNombreDepartamentos.forEach(el=>{
            const fallecidosDepartamento = element.departamentos.find(({departamento})=>departamento===el)
            if(fallecidosDepartamento!=undefined){
                objFallecidosCantidad[el] += fallecidosDepartamento.cantidad
            }
        })
        Object.assign(objChartFallecidosCantidad, objFallecidosCantidad)
        dataset.fallecidosDepartamentos.push(objChartFallecidosCantidad)

    })
    return dataset
}
