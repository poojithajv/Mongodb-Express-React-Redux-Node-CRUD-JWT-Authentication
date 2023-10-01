const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  getallusers,
  updateuser,getuser, deleteuser
} = require("../controller/UserController");
const validateToken = require("../middleware/ValidateToken");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);
router.get('/getallusers', validateToken,getallusers)
router.get("/getuserbyid/:id",validateToken,getuser)
router.put("/updateuserbyid/:id",validateToken,updateuser)
router.delete("/deleteuserbyid/:id",validateToken,deleteuser)
router.get("/currentuser", validateToken, currentUser);

module.exports = router;