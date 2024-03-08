const express = require("express");
const router = express.Router();

const {createNewSlot} = require("../../controllers/LeadMgmt/CouncillingSlots/createNewSlot");
router.post("/createNewSlot",createNewSlot);

const {createDailySlots} = require("../../controllers/LeadMgmt/CouncillingSlots/createDailySlots");
router.post("/createDailySlots",createDailySlots);

const {getSlotBySlotId} = require("../../controllers/LeadMgmt/CouncillingSlots/getSlotBySlotId");
router.get("/getSlotBySlotId/:slotId",getSlotBySlotId);

const {getDailySlotsCount} = require("../../controllers/LeadMgmt/CouncillingSlots/getDailySlotsCount");
router.get("/getDailySlotsCount",getDailySlotsCount);

const {getSlotsPeriod} = require("../../controllers/LeadMgmt/CouncillingSlots/getSlotsPeriod");
router.get("/getSlotsPeriod",getSlotsPeriod);

const {assignSlot} = require("../../controllers/LeadMgmt/CouncillingSlots/assignSlot");
router.put("/assignSlot",assignSlot);

const {bookSlots} = require("../../controllers/LeadMgmt/CouncillingSlots/bookSlots");
router.put("/bookSlots",bookSlots);

const {cancelSlot} = require("../../controllers/LeadMgmt/CouncillingSlots/cancelSlot");
router.put("/cancelSlot",cancelSlot);

const {completeSlot} = require("../../controllers/LeadMgmt/CouncillingSlots/completeSlot");
router.put("/completeSlot",completeSlot);

const {getListOfAvailableSlotsByTime} = require("../../controllers/LeadMgmt/CouncillingSlots/getListOfAvailableSlotsByTime");
router.get("/getListOfAvailableSlotsByTime",getListOfAvailableSlotsByTime);


module.exports = router