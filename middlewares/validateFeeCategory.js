const joi = require("joi");

const validateFee = (req, res, next) => {
  const schema = joi.object({
    name: joi
      .string()
      .trim()
      .required()
      .pattern(new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,50}$"))
      .messages({
        "any.required": "Fee category name is required.",
        "string.empty": "Fee category name cannot be empty.",
        "string.pattern.base":
          "Fee category name must be 2 to 50 characters and contain only letters, spaces, apostrophes or hyphens.",
      }),
    amount: joi.number().integer().positive().required().messages({
      "any.required": "Amount is required.",
      "number.base": "Amount must be a number.",
      "number.integer": "Amount must be a whole number.",
      "number.positive": "Amount must be greater than zero.",
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

const validateUpdateFee = (req, res, next) => {
  const schema = joi
    .object({
      name: joi
        .string()
        .trim()
        .optional()
        .pattern(new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,50}$"))
        .messages({
          "string.empty": "Fee category name cannot be empty.",
          "string.pattern.base":
            "Fee category name must be 2 to 50 characters and contain only letters, spaces, apostrophes or hyphens.",
        }),
      amount: joi.number().integer().positive().optional().messages({
        "number.base": "Amount must be a number.",
        "number.integer": "Amount must be a whole number.",
        "number.positive": "Amount must be greater than zero.",
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

module.exports = { validateFee, validateUpdateFee, validateUUIDParam };
