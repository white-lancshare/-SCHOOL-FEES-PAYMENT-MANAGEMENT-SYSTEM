const express = require('express');
const router = express.Router();
const {createstudentValidation}=require('../middlewares/validateStudent');
const {
  createStudent,
  getAllStudent,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');


router.post('/create', createstudentValidation, createStudent);

router.get('/getAll', getAllStudent);

router.get('/getById/:id', getStudentById);

router.put('/update/:id', updateStudent);

router.delete('/delete/:id', deleteStudent);


module.exports = router;
