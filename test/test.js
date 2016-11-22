import * as pluginIaas from '../src'



//Datos de prueba:
/*
const configPruebas = {
  username: 'rafa',
  privateKey: '/home/ubuntu/.ssh/id_rsa',
  directorioIaas: '/home/rafa/miProyecto',
  host: '95.122.54.178',
  clientID: '02daa6e487c34be4bdec',
  clientSecret: '3a1602d606baf63da78d8f404d6fcf18bbc58e75',
  organizacion: 'ULL-ESIT-GRADOII-DSI'
}*/



async function testStart () {
  let configPruebas = await pluginIaas.config()
  await pluginIaas.start(configPruebas)
}
/*
async function testDeploy () {
  //let configPruebas = await pluginIaas.config()
  //await pluginIaas.start(configPruebas)
  await pluginIaas.deploy(configPruebas)
}*/

testStart().catch(console.error)