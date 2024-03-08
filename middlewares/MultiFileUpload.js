const multer = require('multer')

// var storage = multer.memoryStorage()

// var upload = multer({ storage: storage })

// module.exports = upload

const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "controllers/HRMgmt/Employee/employeeCredentials") },
    filename: (req, file, cb) => { cb(null, file.originalname) }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "application/pdf" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true)
    } else { cb(null, false) }
}

uploadHandler = multer({ storage: storageEngine, fileFilter: fileFilter })

module.exports = uploadHandler;