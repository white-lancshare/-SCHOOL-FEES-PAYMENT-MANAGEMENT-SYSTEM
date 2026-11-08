const Joi = require("joi");

const createStudentValidation = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .pattern(new RegExp("^[A-Za-z]{3,}$"))
      .required()
      .messages({
        "any.required": "First name must be entered.",
        "string.empty": "First name cannot be empty",
        "string.pattern.base":
          "First name cannot contain numbers, special characters or spaces and must be at least 3 characters.",
      }),
    lastName: Joi.string()
      .trim()
      .pattern(new RegExp("^[A-Za-z]{3,}$"))
      .required()
      .messages({
        "any.required": "Last name must be entered.",
        "string.empty": "Last name cannot be empty",
        "string.pattern.base":
          "Last name cannot contain numbers, special characters or spaces and must be at least 3 characters.",
      }),
    email: Joi.string().email().trim().required().messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Email field must be a valid email address",
    }),
    phoneNumber: Joi.string()
      .trim()
      .pattern(new RegExp("^\\+?[0-9]\\d{1,14}$"))
      .required()
      .messages({
        "any.required": "Phone number is required",
        "string.empty": "Phone number cannot be empty",
        "string.pattern.base": "Phone number must be a valid phone number",
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

const updateStudentValidation = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .pattern(new RegExp("^[A-Za-z]{3,}$"))
      .messages({
        "string.empty": "First name cannot be empty",
        "string.pattern.base":
          "First name cannot contain numbers, special characters or spaces and must be at least 3 characters.",
      }),
    lastName: Joi.string()
      .trim()
      .pattern(new RegExp("^[A-Za-z]{3,}$"))
      .messages({
        "string.empty": "Last name cannot be empty",
        "string.pattern.base":
          "Last name cannot contain numbers, special characters or spaces and must be at least 3 characters.",
      }),
    email: Joi.string().email().trim().messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Email field must be a valid email address",
    }),
    phoneNumber: Joi.string()
      .trim()
      .pattern(new RegExp("^\\+?[0-9]\\d{1,14}$"))
      .messages({
        "string.empty": "Phone number cannot be empty",
        "string.pattern.base": "Phone number must be a valid phone number",
      }),
  })
    .min(1)
    .messages({
      "object.min": "Provide at least one field to update.",
    });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

const validateUUIDParam = (paramName) => (req, res, next) => {
  const schema = Joi.object({
    [paramName]: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required()
      .messages({
        "string.guid": `Please provide a valid ${paramName}.`,
        "any.required": `${paramName} is required.`,
      }),
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  createStudentValidation,
  updateStudentValidation,
  validateUUIDParam,
};
