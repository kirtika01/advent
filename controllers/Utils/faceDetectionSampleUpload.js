const faceapi = require('@vladmandic/face-api')
const { Canvas, Image } = require("canvas");
faceapi.env.monkeyPatch({ Canvas, Image });
const canvas = require("canvas")

const Face = require("../../models/HRMgmt/Face");
const Employee = require("../../models/HRMgmt/Employee");


exports.faceDetectionSampleUpload = async (req, res) => {

    try {

        console.log("inside faceDetectionSampleUpload")
        await LoadModels();

        console.log("models loaded successfully")

        
        let employee = await Employee.findOne({ employeeId: req.body.employeeId });

        if(!employee){
            throw new Error("Employee Not Found")
        }

        const descriptions = [];

        let detections

        
        const sampleImage1 = await canvas.loadImage(req.files['sampleImage1'][0].buffer);
        console.log("sample image 1 loaded successfully")
        
        const sampleImage2 = await canvas.loadImage(req.files['sampleImage2'][0].buffer);
        console.log("sample image2 loaded successfully")
        
        const sampleImage3 = await canvas.loadImage(req.files['sampleImage3'][0].buffer);
        console.log("sample image3 loaded successfully")

        const sampleImage4 = await canvas.loadImage(req.files['sampleImage4'][0].buffer);
        console.log("sample image4 loaded successfully")

        const sampleImage5 = await canvas.loadImage(req.files['sampleImage5'][0].buffer);
        console.log("sample image5 loaded successfully")

        detections = await faceapi.detectSingleFace(sampleImage1).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);

        console.log("sample image 1 processed successfully")

        detections = await faceapi.detectSingleFace(sampleImage2).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);

        console.log("sample image 2 processed successfully")

        detections = await faceapi.detectSingleFace(sampleImage3).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);

        console.log("sample image 3 processed successfully")

        detections = await faceapi.detectSingleFace(sampleImage4).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);

        console.log("sample image 3 processed successfully")

        detections = await faceapi.detectSingleFace(sampleImage5).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);

        console.log("sample image 3 processed successfully")

        // Create a new face document with the given label and save it in DB

        
        const createFace = new Face({
            label: employee.employeeFullName,
            descriptions: descriptions,
            employeeId: employee.employeeId,
            userName: employee.userName
        });
        await createFace.save();

        console.log("face document created successfully")
        
        return res.status(200).json({
            status: true,
            message: "Face Samples Uploaded Successfully",
            face: createFace
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}

async function LoadModels() {
    // Load the models
    // __dirname gives the root directory of the server
    await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/facialModels");
    await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/facialModels");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/facialModels");
}
  