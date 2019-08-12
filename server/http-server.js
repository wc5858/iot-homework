const http = require('http')
const url = require('url')
const DataPool = require('./DataPool')
const { isNum } = require('./util')

const httpDataPool = new DataPool(100)

http.createServer(request => {
    try {
        const query = url.parse(request.url).query
        const queryData = query.split('&')
        const temperature = queryData[0].split('=')[1]
        const humidity = queryData[1].split('=')[1]
        if (isNum(temperature) && isNum(humidity)) {
            const data = {
                temperature,
                humidity
            }
            httpDataPool.write(data)
        }
    } catch (e) {
        console.log(e)
    }
}).listen(1079)

module.exports = httpDataPool