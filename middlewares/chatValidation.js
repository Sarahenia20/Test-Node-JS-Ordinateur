const yup = require("yup");

// Validation middleware
const validateChat = async (req, res, next) => {
  const schema = yup.object().shape({
    username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
    message: yup.string().required("Message is required").max(200, "Message cannot exceed 200 characters"),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
    next(); // Proceed to the next middleware/controller
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
};

module.exports = { validateChat };
