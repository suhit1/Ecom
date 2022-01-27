const express = require("express");
const app = express();
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const checkAuth = require("./public/middlewares/CheckAuth.js"); //importing module to ceck whether loged in or not!
const getprouductdata = require("./method/getproductdata"); // to get product data
const sendEmail = require("./method/sendEmail"); //importing module to send email
const mongoose = require("mongoose");
const { json, type } = require("express/lib/response");
const e = require("express");
const { clearLine } = require("readline");
const { Module } = require("module");
const req = require("express/lib/request");
const res = require("express/lib/response");

// connecting mongodb data base
mongoose.connect(
  "mongodb+srv://admin-Suhit:Suhit1234@cluster0.eld7f.mongodb.net/DataBase",
  {
    useNewUrlParser: true,
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email_id: String,
  password: String,
  isVerified: Boolean,
  mail_token: String,
});

const user = mongoose.model("user", userSchema);

const productSchema = new mongoose.Schema({
  image: String,
  name: String,
  Price: Number,
  Discription: String,
  id: Number,
  quantity: Number,
});

const product = mongoose.model("product", productSchema);

// product.insertMany([
//   {
//     image: "Shoes.jpg",
//     name: "Shoes",
//     Price: "1500",
//     Discription: "Very Nice Shoes Comfortable to wear",
//     id: 1,
//     quantity: 5,
//   },
//   {
//     image: "Tshirt.jpg",
//     name: "Tshirt",
//     Price: "800",
//     Discription: "Very Nice tshirt Comfortable to wear cotton material",
//     id: 2,
//     quantity: 10,
//   },
//   {
//     image: "Jean.jpg",
//     name: "Jeans",
//     Price: "2000",
//     Discription: "Very Nice Jeans Comfortable to wear fabric",
//     id: 3,
//     quantity: 3,
//   },
//   {
//     image: "Watch.jpg",
//     name: "Watch",
//     Price: "1000",
//     Discription:
//       "Very Nice Watch Comfortable to wear beautifull watch by Titan",
//     id: 4,
//     quantity: 5,
//   },
//   {
//     image: "Jacket.jpg",
//     name: "Jacket",
//     Price: "3000",
//     Discription: "Very Nice Jacket Comfortable to wear And Very Warm",
//     id: 5,
//     quantity: 7,
//   },
//   {
//     image: "Register.jpg",
//     name: "Register",
//     Price: "400",
//     Discription: "Pack of 4",
//     id: 6,
//     quantity: 3,
//   },
//   {
//     image: "Pen.jpg",
//     name: "Pen",
//     Price: "100",
//     Discription: "Pack of 10 Pens",
//     id: 7,
//     quantity: 6,
//   },
//   {
//     image: "Sweater.jpg",
//     name: "Sweater",
//     Price: "1500",
//     Discription: "Very Nice Sweater Comfortable to wear and warm for winters",
//     id: 8,
//     quantity: 10,
//   },
//   {
//     image: "Sunglasses.jpg",
//     name: "Sunglasses",
//     Price: "800",
//     Discription: "Very Nice Sunglasses",
//     id: 9,
//     quantity: 5,
//   },
//   {
//     image: "Facewash.jpg",
//     name: "Facewash",
//     Price: "500",
//     Discription: "Very Nice Facewash",
//     id: 10,
//     quantity: 8,
//   },
//   {
//     image: "Bat.jpg",
//     name: "Bat",
//     Price: "1000",
//     Discription: "Very Nice Bat, Leather stock season bat",
//     id: 11,
//     quantity: 5,
//   },
//   {
//     image: "Cap.jpg",
//     name: "Cap",
//     Price: "200",
//     Discription: "Very Nice Cap",
//     id: 12,
//     quantity: 9,
//   },
//   {
//     image: "Mask.jpg",
//     name: "Mask",
//     Price: "400",
//     Discription: "Set of 10 Masks",
//     id: 13,
//     quantity: 6,
//   },
//   {
//     image: "Socks.jpg",
//     name: "Socks",
//     Price: "100",
//     Discription: "Set of 10 Masks",
//     id: 14,
//     quantity: 7,
//   },
//   {
//     image: "Wallet.jpg",
//     name: "Wallet",
//     Price: "400",
//     Discription: "Set of 10 Masks",
//     id: 15,
//     quantity: 8,
//   },
// ]);

const cartSchema = new mongoose.Schema({
  id: Number,
  image: String,
  name: String,
  username: String,
  cart_quantity: Number,
  product_quantity: Number,
  price: Number,
});

const cart = mongoose.model("cart", cartSchema);

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
    let match = false;
    let verified = false;

    user.find((err, data) => {
      if (data.length === 0) {
        res.render("login", { error: "Signup First" });
        return;
      }
      data.forEach((el) => {
        if (
          el.name === req.body.Username &&
          el.password === req.body.password
        ) {
          match = true;
          if (el.isVerified === true) verified = true;
        }
      });

      img_name = "";

      if (match && verified) {
        req.session.isloggedin = true;
        req.session.username = req.body.Username;
        req.session.filename = img_name;
        req.session.index = 0;
        req.session.isVerified = true;
        console.log(req.session);
        // res.render("login", { error: "Successfully Loged In" }); we cant send this beacuse if we will send this then we cant redirect using sedn because res can be used only once
        // res.render("user", { username: req.session.username });
        res.redirect("/user");
        return;
      } else if (!match) {
        res.render("login", { error: "Either Username Or Password is Wrong!" });
      } else if (!verified) {
        res.render("login", { error: "Your Account is not verified" });
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
    // checking that all fields are filled or not
    if (!req.body.Username || !req.body.password || !req.body.password) {
      res.render("signup", { error: "Please Fill All Fields" });
      return;
    }

    user.find((err, data) => {
      let username_found = false;
      data.forEach((el) => {
        if (el.name === req.body.Username) username_found = true;
      });

      let email_id_found = false;

      data.forEach((el) => {
        if (el.email_id === req.body.email_id) email_id_found = true;
      });

      const mail_token = Date.now(); // creating token to verify for later on

      if (username_found) {
        res.render("signup", { error: "Username is Already Taken!" });
      } else if (email_id_found) {
        res.render("signup", { error: "Email Id already Exist With Us!" });
      } else {
        // creating a link for sending via email
        const link = `https://suhit-ecom.herokuapp.com/verify/${mail_token}`;

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

        const new_user = new user({
          name: req.body.Username,
          email_id: req.body.email_id,
          password: req.body.password,
          isVerified: false,
          mail_token,
        });
        new_user.save();
      }
    });
  });

app.get("/user", (req, res) => {
  console.log(req.session);
  if (!req.session.isloggedin) {
    res.redirect("/");
    return;
  }
  product.find((err, data) => {
    let arr = [];
    if (req.session.index < data.length - 1) {
      for (let i = 0; i < req.session.index + 5; i++) {
        if (data.length > i) {
          arr.push(data[i]);
          continue;
        }
        break;
      }

      // console.log(arr);

      res.render("user", {
        username: req.session.username,
        products_data: arr,
        isloggedin: true,
      });
      return;
    }
    res.render("user", {
      username: req.session.username,
      products_data: data,
      isloggedin: false,
    });
  });
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
  const { token } = req.params; // in param data gets store after slash i.e / as in this case verify/ after this slas whatever will be there will get store in token variable
  // this token will be in string format
  req.session.username = "";
  //reading data to get mail_token
  console.log(typeof token);
  user.find((err, data) => {
    let token_found = false;
    data.forEach((el) => {
      if (el.mail_token === token) token_found = true;
    });

    console.log(token_found);

    // if found then updating the isverified in database
    if (token_found) {
      // updating
      user.updateOne({ mail_token: token }, { isVerified: true }, (err) => {
        if (err) console.log(`error`);
        else res.send("Account Veriffied You Can now Login");
      });
    } else {
      res.send("Invalid Token");
    }
  });
});

app.get("/forgotpassword", (req, res) => {
  res.render("forgot", { error: "" });
});

app.post("/reset", (req, res) => {
  let forgot_token = Date.now();
  let link = `https://suhit-ecom.herokuapp.com/reset/${forgot_token}`;

  let email_found = false;

  user.find((err, data) => {
    if (data.length == 0) {
      res.render("forgot", { error: "PLz Create An Account First!!" });
      return;
    }

    data.forEach((el) => {
      if (el.email_id === req.body.email_id) {
        email_found = true;
        req.session.username = el.name;
      }
    });

    if (!email_found) {
      res.render("forgot", {
        error: "Email Id Not Found!! Plz Sign Up First",
      });
      return;
    }

    if (email_found) {
      sendEmail(req.body.email_id, "dear", link, "forgotpassword", (err) => {
        if (err) {
          res.render("forgot", { error: "Something Went Wrong" });
        }
        res.render("forgot", {
          error: `A Mail Has Been Sent on your email address
                       Check You email and spam folder`,
        });
      });
    } else {
      res.render("forgot", {
        error: "Email Id Not Found!! Plz Sign Up First",
      });
    }
  });
});
app.get("/reset/:token", (req, res) => {
  if (!req.session.username) {
    res.send(
      "Plz open the same link in the browser from which you have sent the mail"
    );
    return;
  }
  res.render("resetPassword", { error: "" });
});

app.post("/updatepassword", (req, res) => {
  console.log(req.session);

  user.find((err, data) => {
    data.forEach((el) => {
      if (el.name === req.session.username) {
        user.updateOne(
          { name: el.name },
          { password: req.body.password },
          (err) => {
            if (err) console.log(`error occured whicle changing password`);
            else res.send("Password Updated You Can Now Login");
          }
        );
      }
    });
  });
});

app.get("/cart", (req, res) => {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }

  // reading cart file to get informaton regardin if user has add to cart or not

  cart.find((err, data) => {
    let arr = data.filter((el) => {
      if (el.username === req.session.username) return true;
    });

    if (arr.length === 0) {
      res.render("cart", {
        username: req.session.username,
        isloggedin: true,
        error: "Cart Is Empty!!!",
        quantity: "",
      });
      return;
    }

    res.render("cart", {
      username: req.session.username,
      isloggedin: true,
      error: "",
      cart_data: arr,
      quantity: "",
    });
  });

  return;
});

app.get("/product", (req, res) => {
  req.session.index = 14;
  product.find((err, data) => {
    if (req.session.index < data.length - 1) {
      for (let i = 0; i < req.session.index + 5; i++) {
        if (data.length > i) {
          arr.push(data[i]);
          continue;
        }
        break;
      }

      // console.log(arr);

      res.render("user", {
        username: req.session.username,
        products_data: arr,
        isloggedin: true,
      });
      return;
    }
    res.render("user", {
      username: req.session.username,
      products_data: data,
      isloggedin: false,
    });
  });
});

app.get("/add_to_cart", (req, res) => {
  console.log(req.session);
  if (!req.session.isloggedin) {
    res.redirect("/login");
    return;
  }

  const { product_id } = req.query;

  //reading file to add the product inside cart database from  products database

  cart.findOne(
    { username: req.session.username, id: parseInt(product_id) },
    (err, data) => {
      console.log(data);
      if (data !== null) {
        // if not found anything then it will return null
        if (
          data.username === req.session.username &&
          data.id === parseInt(product_id)
        ) {
          console.log("true");
          user_Exist_cart = true;
          res.redirect("/user");
          return;
        } else {
          product.findOne({ id: parseInt(product_id) }, (err, data) => {
            // console.log(data);
            let add_item = new cart({
              id: data.id,
              image: data.image,
              product_name: data.name,
              username: req.session.username,
              cart_quantity: 1,
              product_quantity: data.quantity,
              price: data.Price,
            });
            add_item.save();
            res.redirect("/user");
          });
        }
      } else {
        product.findOne({ id: parseInt(product_id) }, (err, data) => {
          // console.log(data);
          let add_item = new cart({
            id: data.id,
            image: data.image,
            product_name: data.name,
            username: req.session.username,
            cart_quantity: 1,
            product_quantity: data.quantity,
            price: data.Price,
          });
          add_item.save();
          res.redirect("/user");
        });
      }
    }
  );
});

app.get("/remove_product_id", (req, res) => {
  const { product_id } = req.query; // this product_id will be in string format

  cart.deleteOne(
    { id: parseInt(product_id), username: req.session.username },
    (err) => {
      res.redirect("/cart");
    }
  );
});

app.get("/plus_quantity", (req, res) => {
  const { product_id } = req.query;

  console.log(product_id);

  // reading file to update data

  cart.find((err, data) => {
    data.forEach((el) => {
      if (
        el.username === req.session.username &&
        el.id === parseInt(product_id)
      ) {
        let cartquantity = el.cart_quantity + 1;
        if (cartquantity <= el.product_quantity) {
          cart.updateOne(
            { username: req.session.username, id: parseInt(product_id) },
            { cart_quantity: cartquantity },
            (err) => {
              if (err) console.log(`err`);
              res.redirect("/cart");
            }
          );
        } else {
          res.redirect("/cart");
        }
      }
    });
  });
});

app.get("/minus_quanity", (req, res) => {
  const { product_id } = req.query;

  console.log(product_id);

  // reading file to update data

  cart.find((err, data) => {
    data.forEach((el) => {
      if (
        el.username === req.session.username &&
        el.id === parseInt(product_id)
      ) {
        let cartquantity = el.cart_quantity - 1;
        if (cartquantity >= 0) {
          cart.updateOne(
            { username: req.session.username, id: parseInt(product_id) },
            { cart_quantity: cartquantity },
            (err) => {
              if (err) console.log(`err`);
              res.redirect("/cart");
            }
          );
        } else {
          res.redirect("/cart");
        }
      }
    });
  });
});

app.get("/checkout", (req, res) => {
  // reaading file to display total amount to pay
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }

  let amount = 0;

  cart.find((err, data) => {
    data.forEach((el) => {
      if (el.username === req.session.username)
        amount += el.price * el.cart_quantity;
    });

    console.log(amount);
    res.render("checkout", { bill: amount });
  });
});

app.get("/buy", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
    return;
  }

  cart.deleteMany({ username: req.session.username }, (err) => {
    if (err) console.log(`error`);
    else res.render("thankyou");
  });
});

app.listen(process.env.PORT || 8000, (err) => {
  console.log(`Port is Listening at 8000`);
});
