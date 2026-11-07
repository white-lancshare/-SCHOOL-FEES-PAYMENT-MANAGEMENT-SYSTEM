const joi=require('joi')

const createInvoiceValidation=async(req,res,next)=>{

const schema= joi.object({
 studentId:joi.string().optional(),
feeCategoryId:joi.string().optional(),
dueDate:joi.date().required(),
amount:joi.number().required().messages({
  'any.required':"amount is required",
    // 'string.empty':"amount cannot be empty",
}),

status:joi.string().required().messages({
    'any.required':"status is required",
    'string.empty':"status cannot be empty",
}),
})

const {error}=schema.validate(req.body)     

if(error){
    return res.status(400).json({
        message:error.details[0].message
    })
}
    next()
}

module.exports={createInvoiceValidation}