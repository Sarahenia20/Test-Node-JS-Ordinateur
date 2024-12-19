const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found");
  res.send(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send({ message: "User deleted" });
};
// Search by Name
exports.searchUserByName = async (req, res) => {
    try {
      const { name } = req.query; // Extract name from query parameters
      const users = await User.find({ name: new RegExp(name, "i") }); // Case-insensitive
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Search by Age
  exports.searchUserByAge = async (req, res) => {
    try {
      const { age } = req.query; // Extract age from query parameters
      const users = await User.find({ age });
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Search by Email
  exports.searchUserByEmail = async (req, res) => {
    try {
      const { email } = req.query; // Extract email from query parameters
      const users = await User.find({ email });
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };