import express from "express";
import * as iztro from "iztro";

const app = express();
app.use(express.json());

app.post("/api/chinese_chart", async (req, res) => {
  try {
    console.log("📅 Incoming birth data:", req.body);
    console.log("🔍 iztro keys:", Object.keys(iztro));

    // print deeper keys for each submodule
    for (const key of Object.keys(iztro)) {
      try {
        const sub = iztro[key];
        if (sub && typeof sub === "object") {
          console.log(`🔹 Submodule ${key}:`, Object.keys(sub));
        }
      } catch (err) {
        console.error(`❌ Failed to read submodule ${key}:`, err);
      }
    }

    res.json({ message: "Check Render logs for iztro submodule structure." });
  } catch (err) {
    console.error("🔥 Full error details:", err);
    res.status(500).json({ error: "Chart generation failed." });
  }
});

app.get("/", (req, res) => {
  res.send("🪶 Diagnostic mode: check Render logs for iztro submodules.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✨ Chinese Astrology API (diagnostic) running on port ${PORT}`)
);
