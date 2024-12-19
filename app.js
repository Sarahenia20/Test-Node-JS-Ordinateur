const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http"); // Required for Socket.IO
const { Server } = require("socket.io"); // Socket.IO server
const chatController = require("./controllers/chatController");
const { validateChat } = require("./middlewares/chatValidation");

// Import Controllers
const userController = require("./controllers/userController");
const productController = require("./controllers/productController");
const ordinateurController = require("./controllers/ordinateurController");

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server); // Attach Socket.IO to the server

// Middleware
app.use(express.json()); // Parse JSON bodies
app.set("views", path.join(__dirname, "views")); // Set views directory
app.set("view engine", "twig"); // Set Twig as the view engine

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/express-chat-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("🚀 Connected to MongoDB");
});

// Routes
app.get("/", (req, res) => res.render("index", { title: "Welcome to Express Chat App" }));

// Chat Routes
app.post("/chats", validateChat, chatController.createMessage); // Create a new chat message
app.get("/chats", chatController.getMessages); // Retrieve all chat messages

// User Routes
app.post("/users", userController.createUser);
app.get("/users", userController.getUsers);
app.get("/users/:id", userController.getUserById);
app.put("/users/:id", userController.updateUser);
app.delete("/users/:id", userController.deleteUser);
app.get("/users/search/name", userController.searchUserByName); // Search by name
app.get("/users/search/age", userController.searchUserByAge);   // Search by age
app.get("/users/search/email", userController.searchUserByEmail); // Search by email

// Product Routes
app.post("/products", productController.createProduct);
app.get("/products", productController.getProducts);
app.get("/products/:id", productController.getProductById);
app.put("/products/:id", productController.updateProduct);
app.delete("/products/:id", productController.deleteProduct);
app.get("/products/search/name", productController.searchProductByName); // Search by name

// Ordinateur Routes
app.post("/ordinateurs", ordinateurController.createOrdinateur);
app.get("/ordinateurs", ordinateurController.getOrdinateurs);
app.get("/ordinateurs/:id", ordinateurController.getOrdinateurById);
app.put("/ordinateurs/:id", ordinateurController.updateOrdinateur);
app.delete("/ordinateurs/:id", ordinateurController.deleteOrdinateur);
app.get("/ordinateurs/search/prix", ordinateurController.searchOrdinateursByPrix);

//Search route 
app.get("/search", (req, res) => {
  res.render("search", { title: "Real-time Search for Ordinateurs" });
});

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("A user connected");

  // Real-time search by category
  socket.on("search categorie", async (query) => {
    if (!query.trim()) {
      socket.emit("search results", []); // Send empty results for empty queries
      return;
    }

    try {
      const Ordinateur = require("./models/Ordinateur");
      const results = await Ordinateur.find({
        categorie: new RegExp(query, "i"), // Case-insensitive partial match
      });
      socket.emit("search results", results); // Send results back to the client
    } catch (error) {
      console.error("Error during search:", error.message);
    }
  });

  // Notify when a user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Notify when a user connects
//   socket.broadcast.emit("notification", "A new user has connected");

//   // Handle typing event
//   socket.on("typing", (username) => {
//     socket.broadcast.emit("typing", `${username} is typing...`);
//   });

//   // Handle message event
//   socket.on("chat message", (msg) => {
//     const chatMessage = {
//       username: msg.username,
//       message: msg.message,
//       date: new Date(),
//     };

//     // Save message to the database
//     const Chat = require("./models/Chat");
//     const chat = new Chat(chatMessage);
//     chat.save();

//     // Broadcast the message to all connected clients
//     io.emit("chat message", chatMessage);
//   });

//   // Notify when a user disconnects
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//     socket.broadcast.emit("notification", "A user has disconnected");
//   });
// });

// io.on("connection", (socket) => {
//     console.log("A user connected");
  
//     // Handle chat message
//     socket.on("chat message", async (msg) => {
//       const Chat = require("./models/Chat");
  
//       // Create a new chat message and save it
//       const chatMessage = new Chat({
//         username: msg.username,
//         message: msg.message,
//       });
//       await chatMessage.save();
  
//       // Broadcast the message, including the date
//       io.emit("chat message", {
//         username: chatMessage.username,
//         message: chatMessage.message,
//         date: chatMessage.date,
//       });
//     });
//   });

// Start the Server
const PORT = 3000;
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
