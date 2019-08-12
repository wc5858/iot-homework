const SerialPort = require("serialport")
const http = require('http')
const mqtt = require('mqtt')
const coap = require('coap')

const serialPort = new SerialPort("COM3", {
    baudRate: 9600
});

let tmp = []

serialPort.on('data', function (data) {
    data = data.toString()
    if (tmp.length > 0 && data.indexOf('T') === 0) {
        let combinedData = tmp.join('').replace(/\r\n/g, '')
        let dataArray = combinedData.split(';')
        let dataMap = {
            temperature: dataArray[0].split('-')[1],
            humidity: dataArray[1].split('-')[1],
            light: dataArray[2].split('-')[1],
            button: dataArray[3].split('-')[1],
        }
        resolve(dataMap)
        tmp = []
    }
    tmp.push(data)
})

function resolve(data) {
    // 向http端口发送温湿度数据
    resolveHttp({
        temperature: data.temperature,
        humidity: data.humidity
    })
    // 向mqtt端口发送光敏数据
    resolveMqtt(data.light)
    // 向coap端口发送开关数据
    resolveCoap(data.button)
}

function resolveHttp(data) {
    http.get(`http://127.0.0.1:1079?temperature=${data.temperature}&humidity=${data.humidity}`, function (req, res) {
        var html = ''
        req.on('data', function (data) {
            html += data
        })
        req.on('end', function () {
            console.info(html)
        })
    }).on('error',e => {})
}

let mqttClient = mqtt.connect('mqtt://localhost:1082')
mqttClient.on('connect', function () {
    mqttClient.subscribe('light', e => {
        if (e) console.log(e)
    })
})

function resolveMqtt(light) {
    mqttClient.publish('light', light)
}

function resolveCoap(btn) {
    let req = coap.request(`coap://localhost/${btn}`)
    req.on('response', function (res) {
        // res.pipe(process.stdout)
    })
    req.on('error',e => {})
    req.end()
}