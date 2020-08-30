const express = require("express");
const cors = require("cors");

let LED_ONE = 0;
let LED_TWO = 0;
let LED_THREE = 0;

const app = express();

app.use(cors());

app.use(express.json());

const esp = express.Router();
const web = express.Router();

app.use("/web", web);
app.use("/esp", esp);

web.get("/states", (req, res) => {
  return res.json({
    one: LED_ONE,
    two: LED_TWO,
    three: LED_THREE,
  });
});

web.post("/states", (req, res) => {
  const { one, two, three } = req.body;

  console.log(req.body);

  LED_ONE = Number(one);
  LED_TWO = Number(two);
  LED_THREE = Number(three);

  return res.json({
    one: LED_ONE,
    two: LED_TWO,
    three: LED_THREE,
  });
});

esp.get("/states", (req, res) => {
  return res.status(200).send(`${LED_ONE}${LED_TWO}${LED_THREE}`);
});

app.listen(3000, () => {
  console.log("App running on 3000");
});
