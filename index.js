import express from "express";
import * as iztro from "iztro";

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

    const date = new Date(year, month - 1, day, hour, minute || 0);
    const sex = gender.toLowerCase() === "male" ? 1 : 0;

    // ✅ Use iztro's built-in bySolar() method
    const chart = iztro.astro.bySolar({
      date,
      gender: sex
    });

    if (!chart) {
      throw new Error("No chart data returned from iztro.");
    }

    console.log("✅ Chart generated successfully");

    res.json({
      bazi: chart.bazi || null,
      ziwei: chart.ziwei || chart.horoscope || chart,
    });

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
