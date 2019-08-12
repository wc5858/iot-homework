const coapData = require('./coap-server')
const httpData = require('./http-server')
const mqttData = require('./mqtt-server')

// 展示部分采用websocket长连接
const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 8888 })

// 连接池
var clients = [];
// 为每个数据池设置添加数据时触发的钩子
coapData.setHook(function (data) {
    clients.forEach(ws => {
        ws.send(`$btn-${data}`)
    })
})

mqttData.setHook(function (data) {
    clients.forEach(ws => {
        ws.send(`$light-${data}`)
    })
})

httpData.setHook(function (data) {
    clients.forEach(ws => {
        ws.send(`$temperature-${data.temperature};humidity-${data.humidity}`)
    })
})

wss.on('connection', function (ws) {
    // 将该连接加入连接池
    clients.push(ws);
    // 首次加载时发送当前数据
    ws.send(JSON.stringify({
        coapData: coapData.read(),
        mqttData: mqttData.read(),
        httpData: httpData.read(),
    }));

    ws.on('close', function (message) {
        // 连接关闭时，将其移出连接池
        clients = clients.filter(function (ws1) {
            return ws1 !== ws
        })
    });
});