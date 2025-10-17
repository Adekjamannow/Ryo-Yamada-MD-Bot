import os from 'os'
import { performance } from 'perf_hooks'

let handler = async (m, { conn }) => {
  // Speed
  let old = performance.now()
  let neww = performance.now()
  let speed = neww - old
  let speed2 = performance.now() - old

  // Runtime
  let uptime = process.uptime() * 1000
  let d = Math.floor(uptime / (1000 * 60 * 60 * 24))
  let h = Math.floor(uptime / (1000 * 60 * 60)) % 24
  let mnt = Math.floor(uptime / (1000 * 60)) % 60
  let s = Math.floor(uptime / 1000) % 60

  // Chat Info
  let chats = Object.values(conn.chats)
  let groups = chats.filter(v => v.id.endsWith('@g.us'))
  let groupsIn = groups.filter(v => !v.metadata?.read_only)
  let groupsLeft = groups.filter(v => v.metadata?.read_only)
  let privates = chats.filter(v => v.id.endsWith('@s.whatsapp.net'))

  // Server Info
  let totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
  let freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
  let usedMem = (totalMem - freeMem).toFixed(2)
  let sessionSize = (JSON.stringify(global.db.data).length / 1024).toFixed(0)

  // CPU Info
  let cpu = os.cpus()[0]
  let cpuModel = cpu.model.trim()
  let cpuCores = os.cpus().length
  let cpuSpeed = cpu.speed

  let txt = `
*「 ⚡ P I N G ⚡ 」*

「 ⏱ SPEED TEST 」
🏮 ${speed.toFixed(0)} ms
🎐 ${speed2.toFixed(0)} ms

「 ⌛ RUNTIME 」
🌸 ${d} Hari
🌸 ${h} Jam
🌸 ${mnt} Menit
🌸 ${s} Detik

「 📂 CHATS 」
🍙 ${groups.length} Group Chats
🍙 ${groupsIn.length} Groups Aktif
🍙 ${groupsLeft.length} Groups Left
🍙 ${privates.length} Personal
🍙 ${chats.length} Total Chats

「 💻 SERVER INFO 」
🔮 RAM : ${usedMem} GB / ${totalMem} GB
🔮 Free RAM : ${freeMem} GB
🔮 Session Size : ${sessionSize} KB
🔮 Platform : ${os.platform()}
🔮 Hostname : ${os.hostname()}

「 🔥 CPU INFO 」
🩵 Model : ${cpuModel}
🩵 Core : ${cpuCores} Cores
🩵 Speed : ${cpuSpeed} MHz
`.trim()

  await conn.reply(m.chat, txt, m)
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^ping$/i
handler.limit = false

export default handler