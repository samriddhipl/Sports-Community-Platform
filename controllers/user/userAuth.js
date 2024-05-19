const User = require("../../models/user");
const { setUser} = require("../../service/auth");
const bcrypt = require("bcrypt");

//Signup
async function handleUserSignUp(req, res) {
  const {
    name,
    email,
    password,
    username,
    city,
    country,
    zip_code,
    categories,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      city,
      country,
      zip_code,
      categories,
    });

    return res.json({ status: "user created!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

//Login
async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "User doesn't exist." });
    }

    console.log(password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: "Invalid credentials." });
    }

    const token = setUser(user);

    res.cookie("token", token, { httpOnly: true });
    return res.json({ status: "Login Success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};
