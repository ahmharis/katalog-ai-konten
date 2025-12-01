const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      reply: "⚠️ API Key belum dipasang di file .env!" 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
      }
    });

    const prompt = `
      Peran: Kamu adalah "Aimin", asisten AI untuk "Tim AI Konten".
      
      Gaya Bicara:
      - Santai, ramah, gunakan kata sapaan "kak", "gan", atau "satset".
      - Jika user menyapa (halo/pagi), balas dengan ceria.
      - Jangan kaku seperti robot.
      
      Pengetahuan Produk:
      - Divisi Analis: Riset produk, mapping market, psikologi market.
      - Divisi Planner: Jadwal konten, ide konten.
      - Divisi Komunikasi: Copywriting, voice over.
      - Divisi Editing: Foto produk, edit foto, model AI, gabung gambar.
      
      Tugas: Jawab pertanyaan user ini: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Error Gemini:", error);
    res.status(500).json({ 
      reply: `Maaf kak, ada gangguan teknis: ${error.message}` 
    });
  }
});

app.listen(port, () => {
  console.log(`Server Aimin berjalan di http://localhost:${port}`);
});
