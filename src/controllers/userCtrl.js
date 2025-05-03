const User = require("../models/UserModel.js");

const JWT_SECRET = process.env.JWT_SECRET;

const userCtrl = {
  getUser: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Foydalanuvchi ID'si kerak!" });
      }

      const user = await User.findById(id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
      }

      res.status(200).json({
        message: "Foydalanuvchi topildi!",
        user,
      });
    } catch (error) {
      console.error("getUser error:", error.message);
      res.status(500).json({
        message: "Server xatosi. Iltimos, keyinroq urinib ko‘ring.",
        error: error.message,
      });
    }
  },
};

module.exports = userCtrl;
