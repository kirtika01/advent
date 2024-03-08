const router = require('express').Router();

const { createNewGeo } = require('../../controllers/HRMgmt/Geo/createNewGeo');
router.post('/createNewGeo', createNewGeo);

const { getGeoByGeoCode } = require('../../controllers/HRMgmt/Geo/getGeoByGeoCode');
router.get('/getGeoByGeoCode/:geoCode', getGeoByGeoCode);

const { getListOfGeo } = require('../../controllers/HRMgmt/Geo/getListOfGeo');
router.get('/getListOfGeo', getListOfGeo);

const {addCountryToGeo} = require('../../controllers/HRMgmt/Geo/addCountryToGeo');
router.put('/addCountryToGeo', addCountryToGeo);

const {getGeoByCountryCode} = require('../../controllers/HRMgmt/Geo/getGeoByCountryCode');
router.get('/getGeoByCountryCode/:countryCode', getGeoByCountryCode);

const {removeCountryFromGeo} = require('../../controllers/HRMgmt/Geo/removeCountryFromGeo');
router.put('/removeCountryFromGeo', removeCountryFromGeo);

const {updateGeo} = require('../../controllers/HRMgmt/Geo/updateGeo');
router.put('/updateGeo', updateGeo);

module.exports = router;