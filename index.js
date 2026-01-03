import express from "express";
import pkg from "iztro";
const { Iztro } = pkg;


const app = express();
app.use(express.json());

// POST endpoint for BaZi + Ziwei chart
app.post("/api/chinese_chart", async (req, res) => {
  try {
    const { year, month, day, hour, minute, gender } = req.body;

    if (!year || !month || !day || hour === undefined || !gender) {
      return res.status(400).json({ error: "Missing required fields: year, month, day, hour, gender." });
    }

    // Create an Iztro instance
    const chart = new Iztro({
      date: new Date(year, month - 1, day, hour, minute || 0),
      gender: gender.toLowerCase() === "male" ? 1 : 0,
    });

    const bazi = chart.getBaZi();
    const ziwei = chart.getZiWei();

    res.json({
      bazi,
      ziwei,
    });
  } catch (err) {
    console.error("Error generating chart:", err);
    res.status(500).json({ error: "Chart generation failed." });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("🪶 Chinese Astrology API is alive. Use POST /api/chinese_chart to generate charts.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✨ Chinese Astrology API running on port ${PORT}`));
