const { Student } = require('../models');

const createStudent = async (req, res) => {
    try {
        const {firstName, lastName, email, phoneNumber } = req.body;

        const student = await Student.findOne({where: {email}})

        if (student) {
            return res.status(400).json({
                message: "Student already exist"
            })
        }
        
        const newStudent = await Student.create({ firstName, lastName, email, phoneNumber, });

        res.status(201).json({ 
            message: 'Student created successfully',
            data:newStudent
        });


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllStudent = async (req, res)=> {
try{
    const foundStudent = await Student.findAll();
    res.status(200).json({
        message: 'All student retrieved successfully',
        data: foundStudent
    });
}catch(e){
    res.status(400).json({ message: e.message });
} 
    
}

const getStudentById = async (req, res) => {
try{
    const student = await Student.findByPk(req.params.id);
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({
        message: 'Student retrieved successfully',
        data: student
    });
}catch(e){
    res.status(400).json({ message: e.message });
}
};

  const updateStudent = async (req, res) => {
  try {
    const id =req.params.id
    const {firstName, lastName, email, phoneNumber } = req.body;
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

   const updated = await Student.update(
        {firstName, lastName, email, phoneNumber }
    ,{where:{id}});

    res.status(200).json({
      message: 'Student updated successfully',
      data: updated
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const {id} = req.params
    
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    await Student.destroy({where: {id}});

    res.status(200).json({
      message: 'Student deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
createStudent,
  getAllStudent,
  getStudentById,
  updateStudent,
  deleteStudent
};