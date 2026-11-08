const joi = require("joi");

const createInvoiceValidation = (req, res, next) => {
  const schema = joi.object({
    studentId: joi
      .string()
      .trim()
      .guid({ version: ["uuidv4"] })
      .required()
      .messages({
        "any.required": "Student ID is required.",
        "string.empty": "Student ID cannot be empty.",
        "string.guid": "Please provide a valid student ID.",
      }),
    feeCategoryId: joi
      .string()
      .trim()
      .guid({ version: ["uuidv4"] })
      .required()
      .messages({
        "any.required": "Fee category ID is required.",
        "string.empty": "Fee category ID cannot be empty.",
        "string.guid": "Please provide a valid fee category ID.",
      }),
    amount: joi.number().integer().positive().required().messages({
      "any.required": "Amount is required.",
      "number.base": "Amount must be a number.",
      "number.integer": "Amount must be a whole number.",
      "number.positive": "Amount must be greater than zero.",
    }),
    dueDate: joi
      .string()
      .trim()
      .isoDate()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        "any.required": "Due date is required.",
        "string.empty": "Due date cannot be empty.",
        "string.isoDate": "Please provide a valid due date.",
        "string.pattern.base": "Due date must use YYYY-MM-DD format.",
      }),
  });

  const { error } = schema.validate(req.body, { convert: false });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

const updateInvoiceValidation = (req, res, next) => {
  const schema = joi
    .object({
      amount: joi.number().integer().positive().optional().messages({
        "number.base": "Amount must be a number.",
        "number.integer": "Amount must be a whole number.",
        "number.positive": "Amount must be greater than zero.",
      }),
      dueDate: joi
        .string()
        .trim()
        .isoDate()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .optional()
        .messages({
          "string.empty": "Due date cannot be empty.",
          "string.isoDate": "Please provide a valid due date.",
          "string.pattern.base": "Due date must use YYYY-MM-DD format.",
        }),
    })
    .min(1)
    .messages({
      "object.min": "Provide at least one field to update.",
    });

  const { error } = schema.validate(req.body, { convert: false });
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

const validateUUIDParam = (paramName) => (req, res, next) => {
  const schema = joi.object({
    [paramName]: joi
      .string()
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
  createInvoiceValidation,
  updateInvoiceValidation,
  validateUUIDParam,
};
