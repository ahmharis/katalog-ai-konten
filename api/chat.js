import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Cek Metode (Hanya boleh POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Ambil pesan dari Frontend
  const { message } = req.body;

  try {
    // 3. Koneksi ke Google Gemini (API Key dari Vercel)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Gunakan model flash terbaru
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.9, // Supaya jawaban luwes/tidak kaku
        }
    });

    // 4. Instruksi Kepribadian Aimin
    const prompt = `
      Peran: Kamu adalah "Aimin", asisten AI untuk "Tim AI Konten".
      
      Gaya Bicara: 
      - Gunakan Bahasa Indonesia yang luwes, santai, tapi tetap sopan.
      - Sapa pengguna dengan "Kak" atau "Bestie" sesekali.
      
      Pengetahuan Produk:
      - Divisi Analis: Riset produk, mapping market.
      - Divisi Planner: Jadwal konten, ide konten.
      - Divisi Komunikasi: Copywriting, voice over.
      - Divisi Editing: Foto produk, edit foto, model AI.
      
      Tugas: Jawab pertanyaan user ini: ${message}
    `;

    // 5. Generate Jawaban
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Kirim Jawaban ke Frontend
    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Error Gemini:", error);
    return res.status(500).json({ error: 'Gagal menghubungi AI' });
  }
}
