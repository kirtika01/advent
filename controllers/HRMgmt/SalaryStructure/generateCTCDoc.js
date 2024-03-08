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

const SalaryStructure = require("../../../models/HRMgmt/SalaryStructure");
const Employee = require("../../../models/HRMgmt/Employee");

exports.generateCTCDoc = async (req, res) => {

    try {

        const token = req.headers.authorization.split(" ")[1];

        const toWords = new ToWords();
        let count = 1

        let salaryStructure = await SalaryStructure.findOne({ salaryStructureId: req.body.salaryStructureId });

        if(!salaryStructure){
            throw new Error(`Salary Structure not found`)
        }

        console.log(salaryStructure )
        let employee = await Employee.findOne({ employeeId: salaryStructure.employeeId });

        console.log(employee);
        
        if(!employee){
            
            throw new Error(`Employee not found`)
        }

        let ejsFile = "ctcDocument.ejs"


        ejs.renderFile(
            path.join(__dirname, "../../../views/HRMgmt", ejsFile),
            {
                moment: moment,
                toWords: toWords,
                salaryStructure: salaryStructure,
                employee: employee,
                count:count


            },
            (err, data) => {
                if (err) {
                    throw new Error(err);
                }
                else {
                    let options = { format: 'A4' };

                    // convert ejs into pdf file using puppeteer
                    puppeteer.launch({
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


                        const filestream = fs.readFile(path.join(__dirname, "../../../ctcDocument.pdf"),
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
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: `Internal Server Error`,
        });
    }
}