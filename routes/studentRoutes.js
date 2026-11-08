const express = require("express");
const router = express.Router();
const {
  createStudentValidation,
  updateStudentValidation,
  validateUUIDParam,
} = require("../middlewares/validateStudent");
const {
  createStudent,
  getAllStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.post("/", createStudentValidation, createStudent);
router.get("/", getAllStudent);
router.get("/:id", validateUUIDParam("id"), getStudentById);
router.patch(
  "/:id",
  validateUUIDParam("id"),
  updateStudentValidation,
  updateStudent,
);
router.delete("/:id", validateUUIDParam("id"), deleteStudent);

module.exports = router;
