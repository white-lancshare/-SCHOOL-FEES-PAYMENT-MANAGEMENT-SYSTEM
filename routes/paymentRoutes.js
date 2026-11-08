const router = require("express").Router();

const {
  createPaymentValidator,
  updatePaymentValidator,
  validateUUIDParam,
} = require("../middlewares/validatePayment");

const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByInvoice,
  getStudentPaymentHistory,
} = require("../controllers/paymentController");

router.post("/", createPaymentValidator, createPayment);
router.get("/", getAllPayments);
router.get("/:id", validateUUIDParam("id"), getPaymentById);
router.patch(
  "/:id",
  validateUUIDParam("id"),
  updatePaymentValidator,
  updatePayment,
);
router.delete("/:id", validateUUIDParam("id"), deletePayment);
router.get(
  "/invoice/:invoiceId",
  validateUUIDParam("invoiceId"),
  getPaymentsByInvoice,
);
router.get(
  "/student/:studentId",
  validateUUIDParam("studentId"),
  getStudentPaymentHistory,
);

module.exports = router;
