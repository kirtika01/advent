const router = require("express").Router();

 const upload = require("../middlewares/Fileupload");
// const authMiddleware = require('../middlewares/Auth')

const {sendEmail} = require('../controllers/Utils/sendEmail');
router.post('/sendEmail' , sendEmail);

const {faceDetectionSampleUpload} = require('../controllers/Utils/faceDetectionSampleUpload');
router.post('/faceDetectionSampleUpload' ,upload.fields([{ name: 'sampleImage1', maxCount: 1 }, { name: 'sampleImage2', maxCount: 1 },{ name: 'sampleImage3', maxCount: 1 },{ name: 'sampleImage4', maxCount: 1 },{ name: 'sampleImage5', maxCount: 1 }]), faceDetectionSampleUpload);

const {faceDetection} = require('../controllers/Utils/faceDetection');
router.post('/faceDetection' ,upload.single('file'), faceDetection);

module.exports = router;