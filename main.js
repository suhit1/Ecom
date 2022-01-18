const express = require("express");
const app = express();
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const checkAuth = require("./public/middlewares/CheckAuth.js"); //importing module

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `${__dirname}/public/profile_pics`);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static("public")); // using express static for routing

app.use(express.static("public/profile_pics"));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for parsing the form data

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs"); // setting an engine for using ejs which i in view folder

app.get("/", checkAuth, (req, res) => {
  res.redirect("/user");
});

// route chaining
app
  .route("/login")
  .get((req, res) => {
    if (req.session.isloggedin === true) {
      console.log(req.session);
      res.redirect("/user");
      return;
    }
    //else
    res.render("login", { error: "" });
  })
  .post((req, res) => {
    //reading file
    fs.readFile("./data.txt", "utf-8", (err, data) => {
      if (err) {
        console.log(`Something Went Wrong!!`);
        return;
      }

      if (data.length === 0) {
        res.render("login", { error: "Signup First" });
        return;
      }

      let filedata = [];

      if (data.length > 0) filedata = JSON.parse(data);

      let found = false;
      let img_name = "";

      filedata.forEach((element) => {
        if (
          element.username === req.body.Username &&
          element.password === req.body.password
        ) {
          found = true;
          img_name = element.profile_pic;
        }
      });

      if (found === true) {
        req.session.isloggedin = true;
        req.session.username = req.body.Username;
        console.log(req.session);
        // res.render("login", { error: "Successfully Loged In" }); we cant send this beacuse if we will send this then we cant redirect using sedn because res can be used only once
        // res.render("user", { username: req.session.username });
        res.redirect("/user");
        return;
      }

      res.render("login", {
        error: "Username Or Password is Incorrect",
      });

      return;
    });
  });

// chain routing

app
  .route("/signup")
  .get((req, res) => {
    if (req.session.isloggedin === true) {
      res.redirect("/user");
      return;
    }
    res.render("signup", { error: "" });
  })
  .post(upload.single("profile_pic"), (req, res) => {
    //reading file
    fs.readFile("./data.txt", "utf-8", (err, data) => {
      if (err) {
        console.log(`Something Went Wrong!!`);
        return;
      }

      let file_data = [];

      if (data.length > 0) file_data = JSON.parse(data);

      if (!req.body.Username || !req.body.password || !req.file.filename) {
        res.render("signup", { error: "Please Fill All Fields" });
        return;
      }

      let namefound = false;

      file_data.forEach((element) => {
        if (element.username === req.body.Username) namefound = true;
      });

      if (namefound) {
        res.render("signup", { error: "Username is Already Taken!" });
        return;
      }

      console.log(req.file);

      file_data.push({
        username: req.body.Username,
        password: req.body.password,
        profile_pic: req.file.filename,
      });

      //writing file
      fs.writeFile("./data.txt", JSON.stringify(file_data), (err) => {
        req.session.filename = req.file.filename;
        res.render("signup", {
          error: "Successfully SignUp Plz Go To Login Page For Sign In!!",
        });
      });
    });
  });

app.get("/user", (req, res) => {
  if (!req.session.isloggedin) {
    res.redirect("/");
    return;
  }
  console.log(req.session);
  res.render("user", {
    username: req.session.username,
    img_src: req.session.filename,
  });
});

app.get("/logout", (req, res) => {
  console.log(req.session);
  req.session.destroy();
  res.redirect("/");
});

app.listen(8000, (err) => {
  console.log(`Port is Listening at 8000`);
});
