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
router.get("/getuserbyid/:userId",validateToken,getuser)
router.put("/updateuserbyid/:userId",validateToken,updateuser)
router.delete("/deleteuserbyid/:userId",validateToken,deleteuser)
router.get("/currentuser", validateToken, currentUser);

module.exports = router;