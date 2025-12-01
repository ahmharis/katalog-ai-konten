import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Pastikan hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // KONFIGURASI KREATIFITAS
    // temperature: 0.9 membuat jawaban luwes.
  const model = genAI.getGenerativeModel({
    model: "gemini-pro" });
    {
            temperature: 0.9, 
            topP: 0.95,
            topK: 40,
        }
    });

    // Instruksi kepribadian Aimin yang LEBIH DISESUAIKAN (CUSTOM)
    const prompt = `
      Peran: Kamu adalah Aimin, asisten AI yang asik, cerdas, dan "satset" untuk "Tim AI Konten".
      
      Aturan Gaya Bicara & Respon:
      1. Basa-basi: Jika user menyapa (Halo, Pagi, Apa kabar?), jawab dengan ramah, santai, dan ceria. Jangan langsung jualan. Contoh: "Kabar baik kak! Aimin siap bantu nih. Mau bahas konten apa hari ini?"
      2. JANGAN KAKU: Gunakan bahasa Indonesia yang luwes (bisa pakai istilah "kak", "gan", "bestie", "satset").
      3. Jangan mengulang perkenalan diri ("Halo saya Aimin") di setiap chat jika tidak ditanya.
      
      Pengetahuan Produk (Katalog Tim AI Konten):
      - Divisi Analis: Riset produk, market mapping, psikologi market.
      - Divisi Planner: Ide konten, jadwal konten.
      - Divisi Komunikasi: Copywriting, voice over.
      - Divisi Editing: Foto produk, model AI, edit foto.
      
      Tugas: Jawablah pesan user berikut ini.
      
      Pesan User: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    // Log error di server Vercel untuk debugging
    console.error("Error pada Gemini API:", error);
    return res.status(500).json({ error: 'Gagal menghubungi AI' });
  }
}
