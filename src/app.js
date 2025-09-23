const User = require("./models/user");

const { validateSignUpData } = require("./utils/validation");
const { connectDB } = require("./config/database");
const { formatError } = require("./utils/errorFormatter");

const express = require("express");
const bcrypt = require("bcrypt");
const z = require("zod");

const app = express();
const port = 3000;
app.use(express.json());

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed: " + err);
  });

//-------------- Signup-----------------

app.post("/signUp", async (req, res) => {
  try {
    // Validate request body
    const validatedData = validateSignUpData(req);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const { password, ...rest } = validatedData;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ ...rest, password: hashedPassword });
    await user.save();

    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return res.status(400).json({ errors: formatError(error) });
    }
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//----------LOGIN--------------------
app.post("/login", async (req, res) => {
  const { email, password } = req?.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "Invalid Credential" });
  }
  const isPasswordValid = await bcrypt.compare(password, user?.password);

  if (!isPasswordValid) {
    res.status(404).json({ error: "Invalid Credential" });
  } else {
    res.send("Successfully LoggedIn");
  }
});

// --------------Get User By Email---------------
app.get("/userByEmail", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Feed Api: Get/ Fetch all the users from db

app.get("/feed", async (req, res) => {
  const users = await User.find({});
  try {
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong" + error);
  }
});
