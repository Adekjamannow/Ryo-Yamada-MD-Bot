// Script Ori By BochilGaming
// Ditulis Ulang Oleh ImYanXiao
// Disesuaikan Oleh ShirokamiRyzen

import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fs from 'fs'

const defaultMenu = {
  before: `
● Nama:  %name
● Nomor: %tag
● Premium: %prems
● Limit: %limit
● Role: %role

${ucapan()} %name!
● Tanggal: %week %weton
● Date: %date
● Tanggal Islam: %dateIslamic
● Waktu: %time

● Nama Bot: %me
● Mode: %mode
● Prefix: [ %_p ]
● Platform: %platform
● Type: Node.JS
● Uptime: %uptime
● Database: %rtotalreg dari %totalreg

⬣───「 INFO CMD 」───⬣
│ Ⓟ = Premium
│ Ⓛ = Limit
▣────────────⬣
%readmore
`.trimStart(),
  header: '╭─────『 %category 』',
  body: '    ᯓ %cmd %isPremium %islimit',
  footer: '╰–––––––––––––––༓',
  after: ``,
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  if (m.isGroup && !global.db.data.chats[m.chat].menu) throw '⚠️ Admin telah mematikan menu'

  try {
    let lprem = 'Ⓟ'
    let llim = 'Ⓛ'
    let tag = '@' + m.sender.split('@')[0]

    let d = new Date(Date.now() + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d.getTime() / 84600000) % 5]
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })
    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)

    let { age, exp, limit, level, role, money } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let premium = global.db.data.users[m.sender].premiumTime
    let prems = `${premium > 0 ? 'Premium' : 'Free'}`
    let platform = os.platform()

    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
      enabled: !plugin.disabled,
    }))

    let tags = {
      'main': '⚔️ Main Menu',
      'ai': '🤖 AI Feature',
      'memfess': '💌 Memfess',
      'downloader': '⬇️ Downloader',
      'internet': '🌐 Internet',
      'anime': '🗡️ Anime',
      'sticker': '✨ Sticker',
      'tools': '🛠️ Tools',
      'group': '👥 Group',
      'fun': '🎮 Fun',
      'search': '🔍 Search',
      'game': '⚡ Game',
      'info': 'ℹ️ Info',
      'owner': '👑 Owner',
      'quotes': '📜 Quotes',
      'exp': '📈 Exp',
      'stalk': '🕵️ Stalk',
      'rpg': '🏹 RPG',
      'sound': '🎶 Sound',
      'audio': '🎧 Audio',
      'random': '🎲 Random',
      'maker': '🎨 Maker',
      'panel': '🖥️ Panel',
      'nsfw': '🍭 NSFW'
    }

    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag) && plugin.help) groups[tag].push(plugin)
    }

    let before = defaultMenu.before
    let header = defaultMenu.header
    let body = defaultMenu.body
    let footer = defaultMenu.footer
    let after = defaultMenu.after

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%_p' + help)
                .replace(/%islimit/g, menu.limit ? llim : '')
                .replace(/%isPremium/g, menu.premium ? lprem : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')

    let replace = {
      '%': '%',
      uptime: muptime,
      me: conn.user.name,
      tag, platform, _p, money, age, name, prems, level, limit, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }

    let text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'),
      (_, name) => '' + replace[name]
    )

    // Kirim thumbnail + caption dari file lokal
    try {
      const thumbBuffer = fs.readFileSync('./media/ryo1.jpg')
      await conn.sendMessage(m.chat, {
        image: thumbBuffer,
        caption: text.trim(),
        mentions: [m.sender]
      }, { quoted: m })
    } catch (e) {
      m.reply('⚠️ Thumbnail gagal dimuat, cek file ./media/ryo.jpg')
    }

    // Kirim voice note dari file lokal
    try {
      let vn = fs.readFileSync('./media/tes.mp3')
      await conn.sendFile(
        m.chat,
        vn,
        'tes.mp3',
        null,
        m,
        true,
        { type: 'audioMessage', ptt: true }
      )
    } catch (e) {
      m.reply('⚠️ Voice note gagal dikirim, cek file ./media/tes.mp3')
    }

  } catch (e) {
    conn.reply(m.chat, '⚠️ Menu sedang error', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(allmenu|help|\?)$/i
export default handler

// Function tambahan
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, ' H ', m, ' M ', s, ' S '].map(v => v.toString().padStart(2, 0)).join('')
}

function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  if (time >= 4 && time < 10) return "Pagi Kak 🌄"
  if (time >= 10 && time < 15) return "Siang Kak ☀️"
  if (time >= 15 && time < 18) return "Sore Kak 🌇"
  return "Malam Kak 🌙"
}