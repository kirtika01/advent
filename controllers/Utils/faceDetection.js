// write a face detection function with faces-api and node js

const faceapi = require('@vladmandic/face-api')
const { Canvas, Image } = require("canvas");
const canvas = require("canvas");
const jwt = require('jsonwebtoken')


const Face = require("../../models/HRMgmt/Face");
const User = require("../../models/User");
const Employee = require("../../models/HRMgmt/Employee");

faceapi.env.monkeyPatch({ Canvas, Image });

exports.faceDetection = async (req, res) => {

    let detectionError = false;
    try{

        console.log("inside faceDetection")
        await LoadModels();
        console.log("models loaded successfully")

        console.log("req.body",req.body)

        let checkEmployee = await Employee.findOne({ userName: req.body.userName });

        if(!checkEmployee){
            res.status(200).json({
                status: true,
                invalidUser:true,
                message: "Employee not Found"
            })
        }

        let  face = await Face.findOne({ userName: req.body.userName });

        if(!face){
            throw new Error("Face not found")
        }

        console.log("face")
        //console.log(face)
        const threshold = 0.9;

        //let descriptions = new Float32Array(Object.values(face.descriptions))

        let descriptions = []
        face.descriptions.forEach((description) => {
            descriptions.push(new Float32Array(Object.values(description)))
        })

        console.log("descriptions")
        //console.log(descriptions)
        face = new faceapi.LabeledFaceDescriptors(face.label, descriptions);
   

        const faceMatcher = new faceapi.FaceMatcher(face, threshold);

        // Read the image using canvas or other method
        const img = await canvas.loadImage(req.file.buffer);

        console.log("img",img)
        let temp = faceapi.createCanvasFromMedia(img);

        // Process the image for the model
        const displaySize = { width: img.width, height: img.height };
        faceapi.matchDimensions(temp, displaySize);

       // Find matching faces
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        
        console.log("detections")
        if(!detections){
            detectionError = true;
            throw new Error("Camera issue. Please try again or use Register Code.")
        }
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        console.log("resizedDetections")
        //console.log (resizedDetections)

        const result = faceMatcher.findBestMatch(resizedDetections.descriptor);
 
        console.log(result)

        let faceLimit =0.5
        if(result._distance > faceLimit){

            return res.status(200).json({
                status: true,
                detectionError:detectionError,
                faceDetected:false,
                message: "Unable to recognize your face.",
                result: result
            })
        }
        else{

            let user = await User.findOne({ userName: req.body.userName })

            if(!user){
                throw new Error( "User not Found")
            }


            token = jwt.sign({ userName: user.userName,employeeId: checkEmployee.employeeId, platform: 'employeeMobile' }, process.env.JWT_KEY, { expiresIn: "8h" })
            return res.status(200).json({
                status: true,
                faceDetected:true,
                detectionError:detectionError,
                token: token,
                userName: user.userName,
                employeeId: checkEmployee.employeeId,
                employeeFirstName: checkEmployee.employeeFirstName,
                message: "Face Detected Successfully",
                result: result
            })
        }

    }
    catch(err){

        console.log(err)

        if(detectionError==true){
            return res.status(200).json({
                status: true,
                detectionError:detectionError,
                faceDetected:false,
                message: err.toString()
            })
        }

        return res.status(500).json({
            status: false,
            detectionError:detectionError,
            message: err.toString()
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

