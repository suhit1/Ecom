const fs = require("fs");

module.exports = (req, res) => {
  fs.readFile("products.txt", "utf-8", (err, data) => {
    data = JSON.parse(data);
    let arr = [];

    console.log(data);

    if (req.session.index < data.length) {
      for (let i = 0; i < req.session.index + 5; i++) {
        if (data.length > i) {
          arr.push(data[i]);
          continue;
        }
        break;
      }

      console.log(arr);

      res.render("user", {
        username: req.session.username,
        img_src: req.session.filename,
        products_data: arr,
      });
      return;
    }
    res.render("user", {
      username: req.session.username,
      img_src: req.session.filename,
      products_data: data,
    });
  });
};
