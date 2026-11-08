const Joi = require('joi');

const createstudentValidation = (req, res, next) => {
const schema = Joi.object({
firstName: Joi.string().trim().pattern(new RegExp('^[A-Za-z]{3,}$')).required().messages({
"any.required": "First name must be entered.",
"string.empty": "First name cannot be empty",
"string.pattern.base": "First name cannot contain number, special characters or empty space and must be at least 3 characters."
}),
lastName: Joi.string().trim().pattern(new RegExp('^[A-Za-z]{3,}$')).required().messages({
"any.required": "Last name must be entered.",
"string.empty": "Last name cannot be empty",
"string.pattern.base": "Last name cannot contain number, special characters or empty space and must be at least 3 characters."
}),
email: Joi.string().email().trim().required().messages({
"any.required": "Email is required",
"string.empty": "Email cannot be empty",
"string.email": "Email field must be a valid email address"
}),
phoneNumber: Joi.string().trim().pattern(new RegExp('^\\+?[0-9]\\d{1,14}$'
)).required().messages({
    "any.required": "phoneNumber is reuired",
    "string.empty":  "phoneNumber cannot be empty",
    "string.pattern.base": "phoneNumber field must be a valid PhoneNumber"

}),
    
})
const { error } = schema.validate(req.body);

if (error) {
res.status(400).json({
message: error.details[0].message
})
}

next()

}




module.exports = { createstudentValidation };