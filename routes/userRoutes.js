const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/*
 * API endpoints relacionados a los usuarios.
 *
 * Notar que todos estos endpoints tienen como prefijo el string "/users",
 * tal como se definió en el archivo `routes/index.js`.
 */

router.get("/", userController.index);
router.post("/", (req, res) => {
  console.log("hola");
  res.send("hola");
});
router.get("/:id", userController.show);
router.patch("/:id", userController.update);
router.delete("/:id", userController.destroy);

module.exports = router;
