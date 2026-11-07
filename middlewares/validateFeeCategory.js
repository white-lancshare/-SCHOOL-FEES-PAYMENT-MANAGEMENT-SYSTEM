const joi= require('joi')

const validateFee=(req,res,next)=>{
const schema= joi.object({
name:joi.string().trim().required().pattern(new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,50}$")).messages({
"string.empty":"you must input a value",
"string.pattern.base":"please input a valid "

}),amount:joi.number().required().messages({
"string.empty":"you must input a value"
}), 
dueDate:joi.date().required().messages({
    "date.base":"input a valid date"
})



})

const{error}= schema.validate(req.body)

if(error){
  return  res.status(400).json({
        message:"there is a server error",
        data:error.details[0].message,
        dat:error.details
    })
}




next()



}

const validateUpdateFee=(req,res,next)=>{
const schema= joi.object({
name:joi.string().trim().optional().pattern(new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,50}$")).messages({
"string.empty":"you must input a value",
"string.pattern.base":"please input a valid "

}),amount:joi.number().optional().messages({
"string.empty":"you must input a value"
}), 
dueDate:joi.date().optional().messages({
    "date.base":"input a valid date"
})

})


const{error}= schema.validate(req.body)

if(error){
  return  res.status(500).json({
        message:"there is a server error",
        data:error.details[0].message
    })
}

next()

}



module.exports={validateFee,validateUpdateFee}