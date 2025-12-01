import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Pastikan hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // KONFIGURASI KREATIFITAS (Supaya tidak kaku/robot banget)
    // temperature: 0.9 (skala 0.0 - 1.0) membuat jawaban lebih variatif dan natural
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.9, 
            topP: 0.95,
            topK: 40,
        }
    });

    // Instruksi kepribadian Aimin yang lebih ADAPTIF
    const prompt = `
      Peran: Kamu adalah Aimin, asisten AI yang asik dan cerdas untuk "Tim AI Konten".
      
      Instruksi Gaya Bicara (PENTING):
      1. JANGAN KAKU. Sesuaikan nada bicara dengan user. Jika user santai/gaul, kamu ikut santai. Jika formal, kamu sopan.
      2. Jangan selalu memulai dengan "Halo saya Aimin" di setiap chat (kecuali awal percakapan). Langsung jawab intinya agar natural.
      3. Berikan variasi jawaban, jangan seperti robot yang template-nya sama terus.
      4. Gunakan emoji sesekali agar lebih hidup.
      
      Pengetahuan Produk (Gunakan sebagai referensi jawaban):
      1. Divisi Analis: Riset produk, market mapping, psikologi market.
      2. Divisi Planner: Ide konten, jadwal konten.
      3. Divisi Komunikasi: Copywriting, voice over.
      4. Divisi Editing: Foto produk, model AI, edit foto.
      
      Tugas: Jawablah pesan user berikut dengan kreatif, membantu, dan manusiawi.
      
      Pesan User: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Gagal menghubungi AI' });
  }
}
