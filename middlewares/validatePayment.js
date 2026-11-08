const Joi = require("joi");

const createPaymentValidator = (req, res, next) => {
  const createPaymentSchema = Joi.object({
    invoiceId: Joi.string()
      .trim()
      .guid({ version: ["uuidv4"] })
      .required()
      .messages({
        "string.guid": "Please provide a valid invoice ID.",
        "string.empty": "Invoice ID cannot be empty.",
        "any.required": "Invoice ID is required.",
      }),

    amount: Joi.number().integer().positive().required().messages({
      "number.base": "Payment amount must be a number.",
      "number.integer": "Payment amount must be a whole number.",
      "number.positive": "Payment amount must be greater than zero.",
      "any.required": "Payment amount is required.",
    }),

    paymentDate: Joi.string()
      .trim()
      .isoDate()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        "string.isoDate": "Please provide a valid payment date.",
        "string.pattern.base": "Payment date must use YYYY-MM-DD format.",
        "any.required": "Payment date is required.",
        "string.empty": "Payment date cannot be empty.",
      }),

    paymentMethod: Joi.string()
      .trim()
      .valid("POS", "Cash", "Transfer", "Card")
      .required()
      .messages({
        "any.only": "Payment method must be POS, Cash, Transfer or Card.",
        "string.empty": "Payment method cannot be empty.",
        "any.required": "Payment method is required.",
      }),
  });

  const { error } = createPaymentSchema.validate(req.body, {
    convert: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};


const updatePaymentValidator = (req, res, next) => {
  const updatePaymentSchema = Joi.object({
    amount: Joi.number().integer().positive().optional().messages({
      "number.base": "Payment amount must be a number.",
      "number.integer": "Payment amount must be a whole number.",
      "number.positive": "Payment amount must be greater than zero.",
    }),

    paymentDate: Joi.string()
      .trim()
      .isoDate()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .messages({
        "string.isoDate": "Please provide a valid payment date.",
        "string.pattern.base": "Payment date must use YYYY-MM-DD format.",
        "string.empty": "Payment date cannot be empty.",
      }),

    paymentMethod: Joi.string()
      .trim()
      .valid("POS", "Cash", "Transfer", "Card")
      .optional()
      .messages({
        "any.only": "Payment method must be POS, Cash, Transfer or Card.",
        "string.empty": "Payment method cannot be empty.",
      }),
  })
    .min(1)
    .messages({
      "object.min": "Provide at least one field to update.",
    });

  const { error } = updatePaymentSchema.validate(req.body, {
    convert: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};


const validateUUIDParam = (paramName) => (req, res, next) => {
  const uuidSchema = Joi.object({
    [paramName]: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required()
      .messages({
        "string.guid": `Please provide a valid ${paramName}.`,
        "any.required": `${paramName} is required.`,
      }),
  });

  const { error } = uuidSchema.validate(req.params, {
    convert: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  createPaymentValidator,
  updatePaymentValidator,
  validateUUIDParam,
};
