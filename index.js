import express from "express";
import iztro from "iztro"; // import default instead of destructuring

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

    // Construct the chart safely
    const chart = new iztro({
      date: new Date(year, month - 1, day, hour, minute || 0),
      gender: gender.toLowerCase() === "male" ? 1 : 0
    });

    console.log("🪶 Chart object created successfully");

    // Call whatever methods exist on this object
    let bazi, ziwei;
    try {
      if (typeof chart.bazi === "function") {
        bazi = chart.bazi();
      } else if (typeof chart.getBaZi === "function") {
        bazi = chart.getBaZi();
      }
    } catch (err) {
      console.error("Error generating BaZi:", err);
    }

    try {
      if (typeof chart.ziwei === "function") {
        ziwei = chart.ziwei();
      } else if (typeof chart.getZiWei === "function") {
        ziwei = chart.getZiWei();
      }
    } catch (err) {
      console.error("Error generating Ziwei:", err);
    }

    if (!bazi && !ziwei) {
      throw new Error("Both BaZi and Ziwei chart generation returned null/undefined");
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
