const fs = require("fs");

module.exports = (req, res) => {
  fs.readFile("products.txt", "utf-8", (err, data) => {
    data = JSON.parse(data);
    let arr = [];

    // console.log(data);

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
};
