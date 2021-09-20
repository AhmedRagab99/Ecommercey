import express, { Application, json, urlencoded } from "express";

const app: Application = express();
app.use(json());
app.use(urlencoded());
app.get("/", (req, res) => {
  res.send("test request");
});

app.listen(5000, () => {
  console.log("ahmed ragab the best one ");
});
