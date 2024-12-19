const mongoose = require("mongoose");

const OrdinateurSchema = new mongoose.Schema({
  modele: { type: String, required: true }, 
  categorie: { type: String, required: true }, 
  dateDeFabrication: { type: Date, required: true }, 
  prix: { type: Number, required: true }, 
});

module.exports = mongoose.model("Ordinateur", OrdinateurSchema);
