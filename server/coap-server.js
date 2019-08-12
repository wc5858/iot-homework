const coap = require('coap')
const DataPool = require('./DataPool')
const { isNum } = require('./util')

const coapDataPool = new DataPool(100)

const server = coap.createServer()

server.listen(function() {
})

server.on('request', function (req, res) {
    let val = req.url.split('/')[1]
    if (isNum(val)) {
        coapDataPool.write(val)
        res.end('ok')
    }
})

module.exports = coapDataPool