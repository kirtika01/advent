const winston = require('winston')
const { transports, level, format } = require('winston')
const path = require('path')
const fs = require('fs')

createSlotLogger = winston.createLogger({
    transports: [
        new transports.File({
            level: 'info',
            filename: path.join('./logs/batchJobs', 'createSlot.log'),
            format: format.combine(format.timestamp(), format.json()),
            maxFiles: '30d'
        }),
        new transports.File({
            level: 'error',
            filename: path.join('./logs/batchJobs', 'createSlot.log'),
            format: format.combine(format.timestamp(), format.json()),
            maxFiles: '30d'
        }),
    ]
})

// var accessLogStream = fs.createWriteStream(path.join('./logs', 'access.log'), { flags: 'a' })
module.exports = {createSlotLogger}