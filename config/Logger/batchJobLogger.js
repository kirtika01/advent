const winston = require('winston')
const { transports, format } = require('winston')
const path = require('path')

exports.getLogger = (fileName) => {
    try {
        const logger = winston.createLogger({
            transports: [
                new transports.File({
                    level: 'info',
                    filename: path.join('./logs', fileName),
                    format: format.combine(format.timestamp(), format.json()),
                    maxFiles: '30d'
                }),
                new transports.File({
                    level: 'error',
                    filename: path.join('./logs', fileName),
                    format: format.combine(format.timestamp(), format.json()),
                    maxFiles: '30d'
                }),
            ]
        });

        return logger;
    } catch (error) {
        console.error(error);
        // You might want to throw the error here instead of logging and returning a response.
        throw error;
    }
};



// const winston = require('winston')
// const { combine, timestamp, json } = winston.format;
// const { transports, level, format } = require('winston')
// const path = require('path')
// const fs = require('fs')

// exports.logger = async (fileName) => {
//     try{

//         let logger = winston.createLogger({
//             transports: [
//                 new transports.File({
//                     level: 'info',
//                     filename: path.join('./logs', fileName),
//                     format: format.combine(format.timestamp(), format.json()),
//                     maxFiles: '30d'
//                 }),
//                 new transports.File({
//                     level: 'error',
//                     filename: path.join('./logs', fileName),
//                     format: format.combine(format.timestamp(), format.json()),
//                     maxFiles: '30d'
//                 }),
//             ]
//         })

//         return logger
//     }

//     catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             success: false,
//             error: error.message
//         })
//     }
// }