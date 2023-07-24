var express = require('express');
var router = express.Router();
const UserModel = require("../models/userModel");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {title: "homepage"});
});

router.get("/signIn", function(req, res, next) {
  res.render("signIn", {title: "sign-In"});
});

router.post("/signIn", async function (req, res, next) {
try {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if(user === null) {
    return res.send(`user not found. <a href="/signin">signin</a>`);
  }
  if (user.password !== password) {
    return res.send(`Incorrect password. <a href="/signin">signin</a>`);
  }

  res.redirect("/profile");

} catch (error) {
  res.send(error);
}
});

router.get("/getemail", function(req, res, next) {
  res.render("getemail", {title: "Forget-password"});
});

router.post("/getemail", function(req, res, next) {
  // res.render("getemail", {title: "Forget-password"});
  res.json(req.body)
});

router.get("/signUp", function(req, res, next) {
  res.render("signUp", {title: "sign-Up"});
});

router.post("/signUp", function(req, res, next) {
  const newuser = new UserModel(req.body)

  newuser
 .save()
 .then(() => res.redirect("/signin"))
 .catch((err) => res.send(err));
});

router.get("/profile", async function(req, res, next) {
  try {
    const users = await UserModel.find();
    res.render("profile", { title: "profile", users });

  } catch (error) {
    res.send(error);
  }
});

router.get("/delete/:id", async function(req, res, next) {
  try {
    const users = await UserModel.findByIdAndDelete(req.params.id);
    res.redirect("/profile");

  } catch (error) {
    res.send(error);
  }
});

router.get("/signOut", function(req, res, next) {
  res.render("signOut", {title: "sign-Out"});
});

router.get("/update/:userId", async function (req, res, next) {
  const currentuser = await UserModel.findOne(
    {
      _id: req.params.userId
   }
  );
    res.render("updateUser", {user: currentuser, title: "Edit user"});
  });

  router.post('/updateuser/:userId', async function (req, res, next){
   const currentuser = await UserModel.findOneAndUpdate(
    {
      _id: req.params.userId
    },{
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }
   )
   res.redirect('/profile')
  })

module.exports = router;
