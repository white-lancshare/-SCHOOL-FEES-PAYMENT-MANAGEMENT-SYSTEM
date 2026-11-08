const express = require("express");
const router = express.Router();
const {
  createfeeCategory,
  getAllfeeCategory,
  deleteFeeCategory,
  getOneFee,
  updateFeeCategory,
} = require("../controllers/feeCategoryController");
const {
  validateFee,
  validateUpdateFee,
  validateUUIDParam,
} = require("../middlewares/validateFeeCategory");

router.post("/", validateFee, createfeeCategory);
router.get("/", getAllfeeCategory);
router.get("/:id", validateUUIDParam("id"), getOneFee);
router.patch(
  "/:id",
  validateUUIDParam("id"),
  validateUpdateFee,
  updateFeeCategory,
);
router.delete("/:id", validateUUIDParam("id"), deleteFeeCategory);

module.exports = router;
