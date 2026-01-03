# Chinese Astrology API

A lightweight Node.js + Express service for computing **BaZi (Four Pillars of Destiny)** and **Ziwei Dou Shu (Purple Star Astrology)** charts.  
Built with the [iztro](https://www.npmjs.com/package/iztro) engine and deployable on [Render](https://render.com).

## 🌠 Features
- Converts birth date/time into BaZi (Heavenly Stems + Earthly Branches)
- Generates full Ziwei Dou Shu chart with palaces, stars, and brightness levels
- Returns clean, structured JSON for easy AI interpretation
- Designed for integration with Custom GPT Actions (like *Astrology Bob*)

## 🚀 Example Endpoint
**POST** `/api/chinese_chart`

### Request
```json
{
  "year": 1991,
  "month": 1,
  "day": 3,
  "hour": 14,
  "minute": 30,
  "gender": "female"
}
