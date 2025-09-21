const express = require("express");
const app = express();
const port = 3000;

app.use("/home", (req, res) => {
  res.send("Hello world kk");
});
app.get("/", (req, res) => {
  res.send("Hello world"); //last
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
