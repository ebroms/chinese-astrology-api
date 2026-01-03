import express from "express";
import * as iztro from "iztro";     // import every export as an object

const app = express();
app.use(express.json());

app.post("/api/chinese_chart", async (req, res) => {
  try {
    const { year, month, day, hour, minute, gender } = req.body;
    console.log("📅 Incoming birth data:", req.body);
    console.log("🔍 iztro type:", typeof iztro);
    console.log("🔍 iztro keys:", Object.keys(iztro));

    // see which of these exist
    const ctor =
      iztro.Iztro ||
      iztro.default ||
      iztro.iztro ||
      iztro.BaZi ||
      iztro.ZiWei;

    if (!ctor) {
      throw new Error(
        "Cannot find a callable constructor/function in iztro export"
      );
    }

    console.log("🪶 Using key:", Object.keys(iztro).find(k => iztro[k] === ctor));

    const chart = new ctor({
      date: new Date(year, month - 1, day, hour, minute || 0),
      gender: gender.toLowerCase() === "male" ? 1 : 0,
    });

    console.log("✅ Chart instance created");

    let bazi, ziwei;
    if (typeof chart.bazi === "function") bazi = chart.bazi();
    else if (typeof chart.getBaZi === "function") bazi = chart.getBaZi();

    if (typeof chart.ziwei === "function") ziwei = chart.ziwei();
    else if (typeof chart.getZiWei === "function") ziwei = chart.getZiWei();

    res.json({ bazi, ziwei });
  } catch (err) {
    console.error("🔥 Full error details:", err);
    res.status(500).json({ error: "Chart generation failed." });
  }
});

app.get("/", (req, res) => {
  res.send("🪶 Chinese Astrology API is alive. Use POST /api/chinese_chart to generate charts.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✨ Chinese Astrology API running on port ${PORT}`));
