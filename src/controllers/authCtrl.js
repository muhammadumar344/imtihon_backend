const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  console.error(
    "Error: JWT_SECRET is not set in environment variables. Please set it to a secure value."
  );
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

const authCtrl = {
  signup: async (req, res) => {
    try {
      const { username, password, email, bio, avatar, role } = req.body;

      if (!username || !password || !email || !role) {
        return res
          .status(400)
          .json({ message: "Iltimos, barcha maydonlarni to'ldiring!" });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          message: "Bunday username mavjud. Iltimos, boshqa username tanlang!",
        });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          message:
            "Ushbu email ro'yxatdan o'tgan. Iltimos, boshqa email kiriting!",
        });
      }

      if (password.length < 4) {
        return res.status(400).json({
          message: "Parol kamida 4 ta belgidan iborat bo'lishi kerak!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        role, 
        bio,
        avatar,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "12h",
      });

      const { password: _, ...userData } = newUser._doc;

      res.status(201).json({
        message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
        user: {
          ...userData,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Server xatosi. Iltimos, keyinroq urinib ko'ring.",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;  

      if (!email || !password) {
        return res.status(400).json({ message: "Email va parol kerak!" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {   
        return res.status(400).json({ message: "Parol noto‘g‘ri" });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

      const { password: _, ...userData } = user._doc;

      res.status(200).json({
        message: "Muvaffaqiyatli tizimga kirdingiz",
        user: {
          ...userData,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Server xatosi. Iltimos, keyinroq urinib ko‘ring.",
        error: error.message,
      });
    }
  },
};

module.exports = authCtrl;
