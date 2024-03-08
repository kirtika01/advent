const express = require("express");
const app = express();
let ejs = require("ejs");
const puppeteer = require("puppeteer");
let path = require("path");
const AWS = require("aws-sdk");
app.set("view engine", "ejs");
const moment = require("moment-timezone");
const { ToWords } = require("to-words");
// app.use(express.static("../../public"));
const fs = require("fs");
const awsConfig = require('../../../config/aws-s3')
var axios = require("axios")

exports.engagementAgreement = async (req,res) => {
    try{

        let ejsFile = "engagementAgreement_NIL.ejs"

        ejs.renderFile(
            path.join(__dirname, "../../../views/Student", ejsFile),
            {
                //json data here

                student:student


            },

            (err, data) => {
                if (err) {
                    throw new Error(err);
                }
                else {
                    let options = { format: 'A4' };

                    puppeteer.launch({
                        executablePath:process.env.CHROMIUM_PATH,
                        headless: "new",
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    }).then(async browser => {

                        const page = await browser.newPage();
                        await page.setContent(data);
                        await page.pdf({
                            path: "ctcDocument.pdf",
                            format: "A4",
                            printBackground: true,
                            margin: {
                                top: "20px",
                                bottom: "40px",
                                left: "20px",
                                right: "20px",
                            },
                        });
                        console.log("done");
                        await browser.close();

                        const filestream = fs.readFile(path.join(__dirname, "../../../engagementAgreement_NIL.pdf"),
                        async (err, data) => {
                            if (err) {
                                throw new Error(err);
                            }
                            var fileName = "CTCDocument" + "_" + salaryStructure.employeeId + "_" + salaryStructure.financialYear + ".pdf";
                            console.log("fileName:", fileName);
    
    
                            const s3 = new AWS.S3(awsConfig);
                            var s3Upload = s3.upload({
                                Bucket: process.env.BUCKET_NAME,
                                Key: "CTCDocument" + "/" + fileName,
                                Body: data,
                                ACL: "public-read",
                            })
                            .promise();

                            return s3Upload
                            .then(async (data) => {
        
        
                                salaryStructure.ctcDocumentLink = data.Location
                                await salaryStructure.save()
            
            
                                return await res.status(200).json({
                                    status: true,
                                    message: "CTC Document Generated",
                                    doc: data.Location,
                                });
                            })
                        }
                        );
                    })
                    .catch((err) => {
                        throw new Error(err);
                    })

                    
                }
            }
        )
    }

    
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: `Internal Server Error`,
        })
    }
}