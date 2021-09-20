require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("./db/conn");
const cookieparser = require("cookie-parser");
app.use(cookieparser());
// todo ==>> express doesn't understand JSON ,to do so,
app.use(express.json());
// todo ===>>> linking to the router part
app.use(require("./router/auth"));

// app.get("/contact", (req, res) => {
//   res.cookie("mahesh", "token");
//   res.send("Hello World from contact");
// });

// todo 3 horoku deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
