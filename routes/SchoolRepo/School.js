const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/Fileupload");

const { createSchool } = require("../../controllers/SchoolRepo/School/createSchool");
router.post('/createSchool', createSchool);

const { getListOfSchool } = require("../../controllers/SchoolRepo/School/getListOfSchool");
router.get('/getListOfSchool', getListOfSchool);

const { getSchoolBySchoolId } = require("../../controllers/SchoolRepo/School/getSchoolBySchoolId");
router.get('/getSchoolBySchoolId/:schoolId', getSchoolBySchoolId);

const { updateSchoolDetailsBySchoolId } = require("../../controllers/SchoolRepo/School/updateSchoolDetailsBySchoolId");
router.put('/updateSchoolDetailsBySchoolId', updateSchoolDetailsBySchoolId);

const { uploadSchoolThumbnailPhoto } = require("../../controllers/SchoolRepo/School/uploadSchoolThumbnailPhoto");
router.post('/uploadSchoolThumbnailPhoto', upload.single("file"), uploadSchoolThumbnailPhoto);

const { uploadSchoolLogo } = require("../../controllers/SchoolRepo/School/uploadSchoolLogo");
router.post('/uploadSchoolLogo', upload.single("file"), uploadSchoolLogo);

const { keywordSearch } = require("../../controllers/SchoolRepo/School/keywordSearch");
router.get('/keywordSearch', keywordSearch);

const { addPhotoGallery } = require('../../controllers/SchoolRepo/School/addPhotoToGallery');
router.put('/addPhotoToGallery', upload.single("file"), addPhotoGallery)

const { deletePhotoFromGallery } = require('../../controllers/SchoolRepo/School/deletePhotoFromGallery');
router.put('/deletePhotoFromGallery', deletePhotoFromGallery)

const {getListOfBookmarkedSchool} = require('../../controllers/SchoolRepo/School/getListOfBookmarkedSchool');
router.get('/getListOfBookmarkedSchool/:employeeId',getListOfBookmarkedSchool)

const {bookmarkSchoolToggle} = require('../../controllers/SchoolRepo/School/bookmarkSchoolToggle');
router.put('/bookmarkSchoolToggle',bookmarkSchoolToggle)


module.exports = router