const express = require("express");
const app = express();
const db = require("./config/db");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.urlencoded({ extended: true }));

async function startServer() {
  app.get("/", async (req, res) => {
    try {
      const [students] = await db.execute(`select * from basic_info`);
      //   console.log(students);

      res.status(200).render("index", {
        students,
      });
    } catch (err) {
      res.status(500).render("err", {
        err,
      });
    }
  });
  app.get("/delete", async (req, res) => {
    const id = parseInt(req.query.id);
    console.log(id);
    try {
      const resp = await db.execute(`DELETE FROM basic_info WHERE id=?`, [id]);
      const [students] = await db.execute(`select * from basic_info`);
      res.render("index", {
        students,
      });
    } catch (err) {
      res.status(500).render("err", {
        err,
      });
    }
  });
  app.get("/edit", async (req, res) => {
    const id = parseInt(req.query.id);
    try {
      const [students] = await db.execute(
        `select * from basic_info where id = ?`,
        [id],
      );
      res.status(200).render("edit", {
        students,
      });
    } catch (err) {
      res.status(500).render("err", err);
    }
  });
  app.post("/edit", async (req, res) => {
    console.log(req.body);
    const id = parseInt(req.body.id);
    const name = req.body.name;
    const email = req.body.email;
    const enrollment = req.body.enrollment;
    const address = req.body.address;

    try {
      const resp = await db.execute(
        "UPDATE basic_info SET name=?, email=?, enrollment=?, address=? WHERE id=?",
        [name, email, enrollment, address, id],
      );
      return res.status(200).render("err", { err: "Updated Successfully" });
    } catch (err) {
      console.log("Error while updating", err);
      res.status(500).render("err", err);
    }
  });
  app.get("/add", (req, res) => {
    res.render("add");
  });
  app.post("/add", async (req, res) => {
    console.log(req.body);

    const name = req.body.name;
    const email = req.body.email;
    const enrollment = req.body.enrollment;
    const address = req.body.address;

    try {
      const resp = await db.execute(
        "INSERT INTO basic_info (name, email, enrollment, address) VALUES ( ?, ?, ?, ?)",
        [name, email, enrollment, address],
      );
      return res.status(200).render("err", { err: "Created Successfully" });
    } catch (err) {
      console.log("Error while updating", err);
      res.status(500).render("err", err);
    }
  });
}
startServer();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
