import fs from 'fs'

export default function formatChartData () {
    const mapValue = fs.readFileSync("public/data/histVacuna.json", { encoding: 'utf8' })
    const mapValuePositivos = fs.readFileSync("public/data/histPositivos.json", { encoding: 'utf8' })
    let fechaCorte = fs.readFileSync("public/data/ultimoCorte.json", { encoding: 'utf8' })
    fechaCorte = JSON.parse(fechaCorte).fechaCorte
    let arrFechas = JSON.parse(mapValuePositivos)

    let dataset = {
        dosisPositivos:[],
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
        aa = matrixMap(aa).join("-")
        bb = matrixMap(bb).join("-")
        return new Date(aa).getTime() - new Date(bb).getTime()
    })

    let acumuladorPrimeraDosis = 0
    let acumuladorPositivos = 0
    arrFechas.forEach(element=>{
        
        const nombre = element.fechaResultado!==undefined?element.fechaResultado:fechaCorte
        let nombreFinal = matrixMap(nombre)
        let nameDataSet = [nombreFinal[2],nombreFinal[1]].join("/")
        
        const cantidadPositivos = element.departamentos.find(({departamento})=>departamento==="TOTAL").cantidad
        acumuladorPositivos += cantidadPositivos
        dataset.comparativaDosisPositivos.push({
            name: nameDataSet,
            value: acumuladorPositivos
        })

    })
    
    return dataset
}
