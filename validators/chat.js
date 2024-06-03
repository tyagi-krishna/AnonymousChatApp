const Joi = require('joi');

// Function to validate message data
const validateMessage = (data) => {
  // Define Joi schema for message validation
  const schema = Joi.object({
    message: Joi.string().required().trim().max(500) // Adding trim and maximum length validation
  });

  // Validate the data against the schema
  return schema.validate(data);
};

module.exports = { validateMessage };
