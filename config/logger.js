const winston = require('winston')
const { transports, level, format } = require('winston')
const path = require('path')
const fs = require('fs')

const logger = winston.createLogger({
    transports:[
        new transports.File({
            level:'info',
            filename: path.join('./logs','info.log'),
            format:format.combine(format.timestamp(), format.json()),
            maxFiles:'30d'
        }),
        new transports.File({
            level:'error',
            filename: path.join('./logs','error.log'),
            format:format.combine(format.timestamp(), format.json()),
            maxFiles:'30d'
        }),
    ]
})

var accessLogStream = fs.createWriteStream(path.join('./logs', 'access.log'), { flags: 'a' })

exports.logger = logger
exports.accessLogStream = accessLogStream