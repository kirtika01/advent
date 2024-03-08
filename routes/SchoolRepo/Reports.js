const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/Fileupload");

const { schoolCountByGeo } = require("../../controllers/SchoolRepo/Reports/schoolCountByGeo");
router.get('/schoolCountByGeo', schoolCountByGeo)

const {schoolDashboardCounts} = require("../../controllers/SchoolRepo/Reports/schoolDashboardCounts");
router.get('/schoolDashboardCounts', schoolDashboardCounts)

module.exports = router;