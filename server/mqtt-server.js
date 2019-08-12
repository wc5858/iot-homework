const mosaca = require('mosca')
const DataPool = require('./DataPool')
const { isNum } = require('./util')

const mqttDataPool = new DataPool(100)

let mosacaServer = new mosaca.Server({
    port: 1082
})
mosacaServer.on('ready', () => {
    console.log('mqtt ready')
})
mosacaServer.on('published', function (packet, client) {
    let val = packet.payload.toString()
    if (isNum(val)) {
        mqttDataPool.write(val)
    }
})

module.exports = mqttDataPool