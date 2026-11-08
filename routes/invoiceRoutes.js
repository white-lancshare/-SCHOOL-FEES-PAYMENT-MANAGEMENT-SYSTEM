const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getAllInvoice,
  getInvoiceById,
  getInvoicesByStudent,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");
const {
  createInvoiceValidation,
  updateInvoiceValidation,
  validateUUIDParam,
} = require("../middlewares/validateInvoice");

router.post("/", createInvoiceValidation, createInvoice);
router.get("/", getAllInvoice);
router.get(
  "/student/:studentId",
  validateUUIDParam("studentId"),
  getInvoicesByStudent,
);
router.get("/:id", validateUUIDParam("id"), getInvoiceById);
router.patch(
  "/:id",
  validateUUIDParam("id"),
  updateInvoiceValidation,
  updateInvoice,
);
router.delete("/:id", validateUUIDParam("id"), deleteInvoice);

module.exports = router;
