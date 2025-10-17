
import { areJidsSameUser } from '@adiwajshing/baileys'
import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn, participants }) => {
  // Ambil target dari mention atau quoted
  const usr = m.quoted ? [m.quoted.sender] : m.mentionedJid
  if (!usr || usr.length === 0) {
    return m.reply(`❌ Format salah!\nGunakan dengan reply atau mention target.\n\nContoh:\n.kick @user`)
  }

  // Filter agar tidak menendang bot sendiri
  const users = usr.filter(u => !areJidsSameUser(u, conn.user.id))
  if (users.length === 0) {
    return m.reply('❌ Tidak ada target valid untuk ditendang.')
  }

  const failed = []
  const success = []

  for (let user of users) {
    // Cek apakah user ada di grup
    const isInGroup = participants.some(p => p.id === user)

    if (!isInGroup) {
      failed.push(user + ' (bukan anggota grup)')
      continue
    }

    try {
      const res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

      // Handle error yang dikembalikan API (array of results)
      if (res[0]?.status === '200') {
        success.push(user)
      } else {
        failed.push(`${user} (gagal: ${res[0]?.status})`)
      }

      await delay(1000)
    } catch (err) {
      failed.push(user + ' (error internal)')
      console.error(`Gagal kick ${user}:`, err)
    }
  }

  // Kirim stiker lucu
  try {
    let res = await fetch('https://files.catbox.moe/h4q4hq.webp')
    let buffer = await res.buffer()
    let sticker = new Sticker(buffer, {
      pack: 'Group Admin',
      author: 'Bot',
      type: 'default',
      categories: ['😡'],
      id: 'kick-sticker',
      quality: 80
    })
    let stickerBuffer = await sticker.toBuffer()
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
  } catch (e) {
    console.warn('❌ Gagal mengirim stiker:', e)
  }
}

handler.help = ['kick']
handler.tags = ['group']
handler.command = /^(kick|dor)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler