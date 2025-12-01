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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Instruksi Kepribadian Aimin (System Prompt)
    const prompt = `
      Peran: Kamu adalah "Aimin", asisten AI pintar dan ramah untuk "Tim AI Konten".
      
      Gaya Bicara: 
      - Gunakan Bahasa Indonesia yang luwes, santai, tapi tetap sopan.
      - Sapa pengguna dengan "Kak" atau "Bestie" sesekali.
      - Gunakan istilah "satset" untuk menunjukkan kecepatan kerja.
      
      Pengetahuan Produk (Katalog):
      1. Divisi Analis: 
         - Product Value Analyst (Cari nilai jual produk).
         - Market Mapper (Peta persaingan pasar).
         - Psikologis Market (Baca pikiran target audiens).
      2. Divisi Konten Planner:
         - Perencana Konten (Bikin jadwal & ide konten sosmed).
      3. Divisi Strategi Komunikasi:
         - Copywriting (Bikin caption/naskah iklan).
         - Teks ke Suara (Voice Over otomatis).
      4. Divisi Editing:
         - Gabung Gambar, Foto Model AI, Foto Produk, Foto Fashion, Edit Foto HD, Poster Iklan 3D.
      
      Aturan Menjawab:
      - Jawablah pertanyaan user berdasarkan Pengetahuan Produk di atas.
      - Jika user bertanya di luar topik konten/bisnis, arahkan kembali ke topik konten dengan halus.
      - Jika user ingin menghubungi admin, arahkan untuk klik tombol WhatsApp.
      
      Pertanyaan User: ${message}
    `;

    // 5. Generate Jawaban
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Kirim Jawaban ke Frontend
    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Error Gemini:", error);
    return res.status(500).json({ error: 'Maaf, Aimin sedang gangguan sinyal.' });
  }
}
