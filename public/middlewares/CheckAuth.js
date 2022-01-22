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
        id: 1,
        quantity: 5,
      },
      {
        image: "Tshirt.jpg",
        name: "Tshirt",
        Price: "800",
        Discription: "Very Nice tshirt Comfortable to wear cotton material",
        id: 2,
        quantity: 10,
      },
      {
        image: "Jean.jpg",
        name: "Jeans",
        Price: "2000",
        Discription: "Very Nice Jeans Comfortable to wear fabric",
        id: 3,
        quantity: 3,
      },
      {
        image: "Watch.jpg",
        name: "Watch",
        Price: "1000",
        Discription:
          "Very Nice Watch Comfortable to wear beautifull watch by Titan",
        id: 4,
        quantity: 5,
      },
      {
        image: "Jacket.jpg",
        name: "Jacket",
        Price: "3000",
        Discription: "Very Nice Jacket Comfortable to wear And Very Warm",
        id: 5,
        quantity: 7,
      },
      {
        image: "Register.jpg",
        name: "Register",
        Price: "400",
        Discription: "Pack of 4",
        id: 6,
        quantity: 3,
      },
      {
        image: "Pen.jpg",
        name: "Pen",
        Price: "100",
        Discription: "Pack of 10 Pens",
        id: 7,
        quantity: 6,
      },
      {
        image: "Sweater.jpg",
        name: "Sweater",
        Price: "1500",
        Discription:
          "Very Nice Sweater Comfortable to wear and warm for winters",
        id: 8,
        quantity: 10,
      },
      {
        image: "Sunglasses.jpg",
        name: "Sunglasses",
        Price: "800",
        Discription: "Very Nice Sunglasses",
        id: 9,
        quantity: 5,
      },
      {
        image: "Facewash.jpg",
        name: "Facewash",
        Price: "500",
        Discription: "Very Nice Facewash",
        id: 10,
        quantity: 8,
      },
      {
        image: "Bat.jpg",
        name: "Bat",
        Price: "1000",
        Discription: "Very Nice Bat, Leather stock season bat",
        id: 11,
        quantity: 5,
      },
      {
        image: "Cap.jpg",
        name: "Cap",
        Price: "200",
        Discription: "Very Nice Cap",
        id: 12,
        quantity: 9,
      },
      {
        image: "Mask.jpg",
        name: "Mask",
        Price: "400",
        Discription: "Set of 10 Masks",
        id: 13,
        quantity: 6,
      },
      {
        image: "Socks.jpg",
        name: "Socks",
        Price: "100",
        Discription: "Set of 10 Masks",
        id: 14,
        quantity: 7,
      },
      {
        image: "Wallet.jpg",
        name: "Wallet",
        Price: "400",
        Discription: "Set of 10 Masks",
        id: 15,
        quantity: 8,
      },
    ];
    fs.writeFile("products.txt", JSON.stringify(data), (err) => {
      if (err) return;
    });
    res.render("main");
  }
};
