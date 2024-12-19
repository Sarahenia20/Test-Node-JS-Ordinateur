const Ordinateur = require("../models/Ordinateur");

exports.createOrdinateur = async (req, res) => {
  try {
    const ordinateur = new Ordinateur(req.body);
    await ordinateur.save();
    res.status(201).json(ordinateur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrdinateurs = async (req, res) => {
  try {
    const ordinateurs = await Ordinateur.find();
    res.json(ordinateurs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdinateurById = async (req, res) => {
  try {
    const ordinateur = await Ordinateur.findById(req.params.id);
    if (!ordinateur) return res.status(404).json({ message: "Ordinateur not found" });
    res.json(ordinateur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrdinateur = async (req, res) => {
  try {
    const ordinateur = await Ordinateur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ordinateur) return res.status(404).json({ message: "Ordinateur not found" });
    res.json(ordinateur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrdinateur = async (req, res) => {
  try {
    const ordinateur = await Ordinateur.findByIdAndDelete(req.params.id);
    if (!ordinateur) return res.status(404).json({ message: "Ordinateur not found" });
    res.json({ message: "Ordinateur deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.searchOrdinateursByPrix = async (req, res) => {
    try {
      const { min, max } = req.query;

      if (!min || !max) {
        return res.status(400).json({ error: "Please provide both min and max values" });
      }
  
      const ordinateurs = await Ordinateur.find({
        prix: { $gte: parseFloat(min), $lte: parseFloat(max) },
      });
  
      res.json(ordinateurs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
