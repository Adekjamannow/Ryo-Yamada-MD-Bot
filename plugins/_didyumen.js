import didyoumean from 'didyoumean'
import similarity from 'similarity'

let handler = m => m

handler.before = async function (m, { match, usedPrefix }) {
  if (!m.text) return
  if ((usedPrefix = (match[0] || '')[0])) {
    let noPrefix = m.text.slice(1).trim()
    if (!noPrefix) return

    let alias = Object.values(global.plugins)
      .filter(v => v.help && !v.disabled)
      .map(v => v.help)
      .flat(1)

    if (!alias.length) return

    let mean = didyoumean(noPrefix, alias) // cari command terdekat
    if (!mean) return

    let sim = similarity(noPrefix.toLowerCase(), mean.toLowerCase())
    let similarityPercentage = Math.round(sim * 100)

    if (mean && noPrefix.toLowerCase() !== mean.toLowerCase()) {
      let text = `❓ *Apakah maksudmu command ini?*\n\n` +
                 `✨ ᴄᴏᴍᴍᴀɴᴅ: *${usedPrefix + mean}*\n` +
                 `📊 ᴋᴇᴍɪʀɪᴘᴀɴ: *${similarityPercentage}%*`

      await this.sendMessage(m.chat, {
        text,
        footer: '🍭 Ryo Yamada Multi Device AutoCorrect',
        buttons: [
          {
            buttonId: `${usedPrefix}${mean}`,
            buttonText: { displayText: `✨ Jalankan ${usedPrefix + mean}` }
          }
        ],
        headerType: 1,
        contextInfo: {
          externalAdReply: {
            title: "🔮 Ryo Yamada Bot",
            body: "✨ Sistem AutoCorrect Command",
            mediaType: 1,
            renderLargerThumbnail: false,
            sourceUrl: "https://whatsapp.com/channel/0029VbAYjQgKrWQulDTYcg2K"
          }
        }
      }, { quoted: m })
    }
  }
}

export default handler