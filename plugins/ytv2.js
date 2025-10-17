// • Feature : ytmp3 & ytmp4
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  let url = args[0]
  if (!url) throw `Contoh: ${usedPrefix + command} https://youtu.be/abc123`

  let isAudio = /ytmp3/i.test(command)
  let endpoint = isAudio
    ? `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`
    : `https://api.zenzxz.my.id/downloader/ytmp4v2?url=${encodeURIComponent(url)}`

  await conn.sendMessage(m.chat, { react: { text: '🍬', key: m.key } })

  try {
    let { data } = await axios.get(endpoint)

    if (!data.status || !data.download_url) throw '❌ Link download tidak ditemukan dari API.'

    let caption = isAudio
      ? `🎶 *${data.title}*\nFormat: MP3`
      : `🎬 *${data.title}*\n📺 Format: ${data.format || 'MP4'}\n⏱ Durasi: ${data.duration || 'N/A'} detik`

    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: data.download_url },
        mimetype: "audio/mpeg",
        fileName: `${data.title}.mp3`,
        caption
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: data.download_url },
        mimetype: "video/mp4",
        fileName: `${data.title}.mp4`,
        caption
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    console.error(e)
    m.reply(`❌ Terjadi kesalahan: ${e?.message || e}`)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

handler.help = ['ytmp3 <url>', 'ytmp4 <url>']
handler.tags = ['downloader']
handler.command = /^(ytmp3|ytmp4)$/i
handler.limit = true

export default handler