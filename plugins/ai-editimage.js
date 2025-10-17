// • Edit Image 
// • Type : Plugins ESM 
// • API : https://api.nekolabs.my.id
// • Author : Hilman 
import fetch from "node-fetch"
import FormData from "form-data"
import cheerio from "cheerio"

async function uploadImage(buffer) {
  const form = new FormData()
  form.append("file", buffer, { filename: "upload.jpg" })

  const res = await fetch("https://upfilegh.alfiisyll.biz.id/upload", {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
  })

  const html = await res.text()
  const $ = cheerio.load(html)
  return $("#rawUrlLink").attr("href")
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ""

  if (!/^image/.test(mime)) return m.reply(`🍭 Balas gambar dulu!\nContoh: ${usedPrefix}${command} ubah jadi anime`)
  if (!text) return m.reply(`✨ Masukkan prompt edit!\nContoh: ${usedPrefix}${command} ubah jadi tersenyum`)

  try {
    const buffer = await q.download()
    const imageUrl = await uploadImage(buffer)
    if (!imageUrl) throw new Error("🍬Gagal upload gambar.")

    const api = `https://api.nekolabs.my.id/ai/gemini/nano-banana?prompt=${encodeURIComponent(text)}&imageUrl=${encodeURIComponent(imageUrl)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.result) throw new Error("🍬API tidak mengembalikan hasil.")

    const result = await fetch(json.result)
    const resultBuffer = await result.buffer()

    await conn.sendMessage(m.chat, { image: resultBuffer, caption: `✨ *Hasil Edit*\nPrompt: ${text}` }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply(`❌ yahh eror!\nError: ${e.message}`)
  }
}

handler.help = ["editimage"]
handler.tags = ["ai", "tools"]
handler.command = /^editimage$/i
handler.limit = true
handler.register = true

export default handler