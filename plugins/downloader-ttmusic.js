/* 
• fitur : tiktok music 
• type : plugins esm 
• API : https://api.nekolabs.my.id
• author : hilman
*/
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Contoh penggunaan:\n${usedPrefix}${command} <link TikTok>`)

  try {
    const urlTikTok = encodeURIComponent(args[0])
    const res = await fetch(`https://api.nekolabs.my.id/downloader/tiktok?url=${urlTikTok}`)
    const json = await res.json()

    if (!json.status) throw '🍬 Gagal mengambil data TikTok'

    const music = json.result.music_info
    const musicUrl = json.result.musicUrl
    const title = music.title
    const info = `🍭 Judul: ${music.title}\n✨ Artist: ${music.author}`

    await conn.sendMessage(m.chat, {
      audio: { url: musicUrl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: m })

    await m.reply(info)

  } catch (e) {
    console.log(e)
    throw `❌ Error\nLogs error : ${e.message || e}`
  }
}

handler.help = ['ttmusic <link>', 'ttmp3 <link>']
handler.tags = ['downloader']
handler.command = /^(ttmusic|ttmp3)$/i
handler.limit = false

export default handler