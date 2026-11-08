const { Student, Invoice } = require("../models");

const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    const student = await Student.findOne({ where: { email } });

    if (student) {
      return res
        .status(409)
        .json({ message: "A student with this email already exists" });
    }

    const newStudent = await Student.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    res.status(201).json({
      message: "Student created successfully",
      data: newStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};

const getAllStudent = async (req, res) => {
  try {
    const foundStudent = await Student.findAll();
    res.status(200).json({
      message: "All students retrieved successfully",
      data: foundStudent,
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};

const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, phoneNumber } = req.body;
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (email) {
      const emailOwner = await Student.findOne({ where: { email } });

      if (emailOwner && emailOwner.id !== id) {
        return res
          .status(409)
          .json({ message: "A student with this email already exists" });
      }
    }

    await Student.update(
      { firstName, lastName, email, phoneNumber },
      { where: { id } },
    );

    const updatedStudent = await Student.findByPk(id);

    res.status(200).json({
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const invoiceCount = await Invoice.count({ where: { studentId: id } });

    if (invoiceCount > 0) {
      return res.status(409).json({
        message: "This student has invoices and cannot be deleted.",
      });
    }

    await Student.destroy({ where: { id } });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};

module.exports = {
  createStudent,
  getAllStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
};
