const fs = require("fs");
module.exports = (req, res, next) => {
  if (req.session.isloggedin === true && req.session.isVerified === true)
    next();
  else if (req.session.isloggedin === true && !req.session.isVerified)
    res.render("notVerified");
  else {
    data = [
      {
        image: "Shoes.jpg",
        name: "Shoes",
        Price: "1500",
        Discription: "Very Nice Shoes Comfortable to wear",
      },
      {
        image: "Tshirt.jpg",
        name: "Tshirt",
        Price: "800",
        Discription: "Very Nice tshirt Comfortable to wear cotton material",
      },
      {
        image: "Jean.jpg",
        name: "Jeans",
        Price: "2000",
        Discription: "Very Nice Jeans Comfortable to wear fabric",
      },
      {
        image: "Watch.jpg",
        name: "Watch",
        Price: "1000",
        Discription:
          "Very Nice Watch Comfortable to wear beautifull watch by Titan",
      },
      {
        image: "Jacket.jpg",
        name: "Jacket",
        Price: "3000",
        Discription: "Very Nice Jacket Comfortable to wear And Very Warm",
      },
      {
        image: "Register.jpg",
        name: "Register",
        Price: "400",
        Discription: "Pack of 4",
      },
      {
        image: "Pen.jpg",
        name: "Pen",
        Price: "100",
        Discription: "Pack of 10 Pens",
      },
      {
        image: "Sweater.jpg",
        name: "Sweater",
        Price: "1500",
        Discription:
          "Very Nice Sweater Comfortable to wear and warm for winters",
      },
      {
        image: "Sunglasses.jpg",
        name: "Sunglasses",
        Price: "800",
        Discription: "Very Nice Sunglasses",
      },
      {
        image: "Facewash.jpg",
        name: "Facewash",
        Price: "500",
        Discription: "Very Nice Facewash",
      },
      {
        image: "Bat.jpg",
        name: "Bat",
        Price: "1000",
        Discription: "Very Nice Bat, Leather stock season bat",
      },
      {
        image: "Cap.jpg",
        name: "Cap",
        Price: "200",
        Discription: "Very Nice Cap",
      },
      {
        image: "Mask.jpg",
        name: "Mask",
        Price: "400",
        Discription: "Set of 10 Masks",
      },
      {
        image: "Socks.jpg",
        name: "Socks",
        Price: "100",
        Discription: "Set of 10 Masks",
      },
      {
        image: "Wallet.jpg",
        name: "Wallet",
        Price: "400",
        Discription: "Set of 10 Masks",
      },
    ];
    fs.writeFile("products.txt", JSON.stringify(data), (err) => {
      console.log(`done`);
      if (err) return;
    });
    res.render("main");
  }
};
