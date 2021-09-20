const express = require("express");
const router = express.Router();
const User = require("../db/schema");
const bcrypt = require("bcrypt");
const authenticate = require("../middlewares/authenticate");

// router.get("/", (req, res) => {
//   res.send("Hello World");
// });

// todo ===>>> using promisses
// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body;
//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "plz fill the form properly" });
//   }
//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "email already exist" });
//       }
//       const user = new User({ name, email, phone, work, password, cpassword });
//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "registered successuflly" });
//           console.log(user);
//         })
//         .catch((err) => res.status(500).json({ error: "failed to register" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
// todo ====>>> using async / await
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "plz fill the form properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    }
    const user = new User({ name, email, phone, work, password, cpassword });

    // ** convert password in hash

    const userRegister = await user.save();
    if (userRegister) {
      res.status(201).json({ message: "registered successuflly" });
    }
  } catch (error) {
    console.log(error);
  }
});

// todo ====>>> Login Route
router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "plz fill the data" });
    }
    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      // todo ==>> comparing the userpassword and DB password
      const isMatch = await bcrypt.compare(password, userLogin.password);

      // todo ===>>> generating jwt token
      token = await userLogin.generateAuthToken();
      // console.log(token);

      // todo ==>> storing token in cookie
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 230000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "invalid details" });
      } else {
        res.status(201).json({ message: "user singn in successfully" });
      }
    } else {
      res.status(400).json({ error: "invalid details" });
    }
  } catch (error) {
    console.log(error);
  }
});

// ? ABOUT US PAGE
router.get("/about", authenticate, (req, res) => {
  // res.send("Hello World from about");
  res.send(req.rootUser);
});
// todo ===>>>  get user data for contact page
router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("contact form error");
      return res.json({ error: "Please fill the data properly" });
    }

    const userContact = await User.findOne({ _id: req.userID });
    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );

      await userContact.save();
      res.status(201).json({ message: "message send" });
      console.log("message send");
    }
  } catch (error) {
    console.log(error);
  }
});
// todo ==>> logout page
router.get("/logout", (req, res) => {
  // res.send(req.rootUser);
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout");
});

module.exports = router;
