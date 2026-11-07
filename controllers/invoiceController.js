const {Invoice,FeeCategory, Student}=require('../models')


const createInvoice= async(req,res)=>{
try{
const { studentId, feeCategoryId,amount,dueDate,status}=req.body

const student= await Student.findByPk(studentId)
if(!student){
  return  res.status(404).json({
    message:"user with this student id does not exist "
    })
}

const fee= await  FeeCategory.findByPk(feeCategoryId)
 
if(!fee){
      return  res.status(404).json({
    message:"user with this feeCategoryid does not exist "
    })
}

const newInvoice= await Invoice.create({
    studentId, feeCategoryId,amount,dueDate,status
})

res.status(201).json({
    message:"invoice created succesfully ",
    data:newInvoice
})
}catch(e){
res.status(500).json({
    message:"there is a server error ",
    data:e.message
})
}
}

const deleteInvoice=async(req,res)=>{
try{
const id=req.params.id

const finder= await Invoice.findByPk(id)

if(!finder){
    return res.status(404).json({
        message:"user with this student id not found"
    })
}

const deleted= await Invoice.destroy({where:{id}})

res.status(200).json({
    message:"invoice deleted sucessfully",
    data:deleted
})

}catch(e){
res.status(500).json({
    message:"there is a server error ",
    data:e.message
})

}
}

const updateInvoice=async(req,res)=>{
try{
const id=req.params.id
const {studentId, feeCategoryId,amount,dueDate,status}=req.body
const finder=await Invoice.findByPk(id)

if(!finder){
    return res.status(404).json({
        message:"invoice with this id does not exist"
    })
}

const updated=await Invoice.update({studentId, feeCategoryId,amount,dueDate,status},{where:{id}})

res.status(200).json({
    message:"invoice has been updated sucessfully",
    data:updated
})


}catch(e){
 res.status(500).json({
    message:"there is a server error",
    val:e.message
 })

}
}
const getAllInvoice=async(req,res)=>{
try{

    const finder= await Invoice.findAll({attributes:['invoiceName','amount','dueDate','status'],include:[
        {
       model:FeeCategory
     },{
        model:Student
     }
    ],
})
    res.status(200).json({
        message:`the total invoice in the database is ${finder.length}`,
        value:finder
    })
}
catch(e){
  res.status(500).json({
    message:"there is a server error",
    val:e.message
})
}
}

const getOneInvoiceForStudent=async(req,res)=>{
    //i passed in the student id
const id=req.params.id
const finder= await Student.findByPk({where:{id},attributes:[' firstName:','lastName','email','phoneNumbetr'],
include:{
    model:  Invoice,
    attributes:['amount','dueDate','status']
}
})

res.status(200).json({
    message:"user found",
  data:finder
})


}

module.exports={createInvoice,deleteInvoice,updateInvoice,getAllInvoice,getOneInvoiceForStudent}