import fs from 'fs'

let handler = async (m, { conn, command }) => {
  // Reaksi awal
  await m.react('🕒')

  // Hitung total fitur (plugin yang punya help & tags)
  let totalFitur = Object.values(global.plugins).filter(v => v.help && v.tags).length

  // Hitung total command dari semua plugin
  let totalCommand = Object.values(global.plugins)
    .map(v => v.command)
    .filter(v => v) // hanya yang punya command
    .map(v => Array.isArray(v) ? v.length : 1)
    .reduce((a, b) => a + b, 0)

  await m.react('✅')

  // Caption informasi bot
  let caption = `
📊 *INFORMASI BOT*

🔧 Total fitur aktif: *${totalFitur}*
📖 Total command aktif: *${totalCommand}*

Ketik *.menu* atau *.help* untuk lihat daftar fitur lengkap.
`.trim()

  // Kirim thumbnail
  await conn.sendFile(m.chat, './media/thumbnail.jpg', 'thumbnail.jpg', caption, m)

  // Kirim audio (voice note) dari file lokal dengan try/catch supaya aman
  try {
    await conn.sendFile(
      m.chat,
      './media/tes2.mp3',
      'menu.mp3',
      null,
      m,
      true,
      {
        type: 'audioMessage',
        ptt: true,
        seconds: 0
      }
    )
  } catch (e) {
    console.error('Gagal kirim audio:', e)
  }
}

// Info handler
handler.help = ['totalfitur']
handler.tags = ['info']
handler.command = ['totalfitur']

export default handler