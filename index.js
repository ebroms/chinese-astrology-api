import express from "express";
import iztro from "iztro";

const app = express();
app.use(express.json());

app.post("/api/chinese_chart", async (req, res) => {
  try {
    const { year, month, day, hour, minute, gender } = req.body;

    if (!year || !month || !day || hour === undefined || !gender) {
      return res.status(400).json({
        error: "Missing required fields: year, month, day, hour, gender."
      });
    }

    console.log("📅 Incoming birth data:", req.body);

    // call iztro as a function instead of using 'new'
    const chart = iztro({
      date: new Date(year, month - 1, day, hour, minute || 0),
      gender: gender.toLowerCase() === "male" ? 1 : 0
    });

    console.log("🪶 Chart created successfully");

    // Attempt both lowercase and legacy method names
    let bazi, ziwei;
    if (typeof chart.bazi === "function") {
      bazi = chart.bazi();
    } else if (typeof chart.getBaZi === "function") {
      bazi = chart.getBaZi();
    }

    if (typeof chart.ziwei === "function") {
      ziwei = chart.ziwei();
    } else if (typeof chart.getZiWei === "function") {
      ziwei = chart.getZiWei();
    }

    if (!bazi && !ziwei) {
      throw new Error("Chart data unavailable; library did not return values.");
    }

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
