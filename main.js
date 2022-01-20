const express = require("express");
const app = express();
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const checkAuth = require("./public/middlewares/CheckAuth.js"); //importing module to ceck whether loged in or not!
const getprouductdata = require("./method/getproductdata"); // to get product data
const sendEmail = require("./method/sendEmail"); //importing module to send email
const { json } = require("express/lib/response");
const e = require("express");
const { clearLine } = require("readline");

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

app.use(express.static("product_images"));

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
    console.log(req.session);
    if (req.session.isloggedin === true) {
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
      let verified = false;

      filedata.forEach((element) => {
        if (
          element.username === req.body.Username &&
          element.password === req.body.password
        ) {
          found = true;
          img_name = element.profile_pic;
        }
        if (
          element.username === req.body.Username &&
          element.isVerified === true
        )
          verified = true;
      });

      console.log("Found=" + found);
      console.log("verified=" + verified);

      if (found === true && verified === true) {
        req.session.isloggedin = true;
        req.session.username = req.body.Username;
        req.session.filename = img_name;
        req.session.index = 0;
        console.log(req.session);
        // res.render("login", { error: "Successfully Loged In" }); we cant send this beacuse if we will send this then we cant redirect using sedn because res can be used only once
        // res.render("user", { username: req.session.username });
        res.redirect("/user");
        return;
      }
      if (!found) {
        res.render("login", {
          error: "Username Or Password is Incorrect",
        });
        return;
      }

      if (!verified) {
        req.session.username = req.body.Username;
        res.render("login", {
          error: "Your Account is not verified",
        });
        return;
      }
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

      // console.log(req.file);
      const mail_token = Date.now();
      file_data.push({
        username: req.body.Username,
        password: req.body.password,
        profile_pic: req.file.filename,
        email_id: req.body.email_id,
        isVerified: false,
        mail_token,
      });

      //writing file
      fs.writeFile("./data.txt", JSON.stringify(file_data), (err) => {
        req.session.filename = req.file.filename;
        req.session.username = req.body.Username;

        console.log(req.session);

        let link = `http://localhost:8000/verify/${mail_token}`;

        // sending email
        sendEmail(
          req.body.email_id,
          req.body.Username,
          link,
          "verification",
          (err) => {
            if (err) {
              res.render("signup", { error: "Something Went Wrong" });
            }
            res.render("signup", {
              error:
                "A Mail Has Been Sent on your email address please Verify your account",
            });
          }
        );
      });
    });
  });

app.get("/user", (req, res) => {
  console.log(req.session);
  if (!req.session.isloggedin) {
    res.redirect("/");
    return;
  }
  getprouductdata(req, res);
});

app.get("/loadmore", (req, res) => {
  req.session.index = req.session.index + 5;
  res.redirect("/user");
});

app.get("/logout", (req, res) => {
  console.log(req.session);
  req.session.destroy();
  res.redirect("/");
});

//for Verification of account
app.get("/verify/:token", (req, res) => {
  console.log(req.session);
  const { token } = req.params; // this toekn will be in string format

  //readiing file to get mail_token
  fs.readFile("data.txt", "utf-8", (err, data) => {
    data = JSON.parse(data);
    let mail_token;
    data.forEach((el) => {
      if (el.username === req.session.username) {
        mail_token = el.mail_token;
      }
    });
    console.log("token=" + parseInt(token));
    console.log("mail_token=" + mail_token);
    if (parseInt(token) === mail_token) {
      fs.readFile("data.txt", "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        data = JSON.parse(data);

        data.forEach((element) => {
          if (element.username === req.session.username)
            element.isVerified = true;
        });

        fs.writeFile("data.txt", JSON.stringify(data), (err) => {
          if (err) {
            console.log(err);
            return;
          }
          res.send("Account Verified Go Back To Home Page and Login!!!");
        });
      });
      return;
    }
    res.render("invalidToken");
  });
});

app.get("/forgotpassword", (req, res) => {
  res.render("forgot", { error: "" });
});

app.post("/reset", (req, res) => {
  let link = `http://localhost:8000/reset/${Date.now()}`;
  fs.readFile("data.txt", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    if (data.length == 0) {
      res.render("forgot", { error: "PLz Create An Account First!!" });
      return;
    }

    data = JSON.parse(data);

    data.forEach((el) => {
      if (el.email_id === req.body.email_id) req.session.username = el.username;
    });
  });
  sendEmail(req.body.email_id, "dear", link, "forgotpassword", (err) => {
    if (err) {
      res.render("forgot", { error: "Something Went Wrong" });
    }
    res.render("forgot", {
      error: "A Mail Has Been Sent on your email address",
    });
  });
});

app.get("/reset/:token", (req, res) => {
  res.render("resetPassword", { error: "" });
});

app.post("/updatepassword", (req, res) => {
  console.log(req.session);
  fs.readFile("data.txt", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    data = JSON.parse(data);

    data.forEach((el) => {
      if (el.username === req.session.username) el.password = req.body.password;
    });

    fs.writeFile("data.txt", JSON.stringify(data), (err) => {
      res.send("Password Updated You Can Now Login");
    });
  });
});

app.get("/product", (req, res) => {
  req.session.index = 14;
  getprouductdata(req, res);
});

app.listen(8000, (err) => {
  console.log(`Port is Listening at 8000`);
});
