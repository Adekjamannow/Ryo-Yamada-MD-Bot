let handler = async (m) => {
  m.reply(`
╭─────『 Menu Audio 』
ᯓ .bass
ᯓ .blown
ᯓ .deep
ᯓ .earrape
ᯓ .fast
ᯓ .fat
ᯓ .nightcore
ᯓ .reverse
ᯓ .robot
ᯓ .slow
ᯓ .smooth
ᯓ .tupai
ᯓ .reverb
ᯓ .chorus
ᯓ .flanger
ᯓ .distortion
ᯓ .pitch
ᯓ .highpass
ᯓ .lowpass
ᯓ .underwater
ᯓ .playncs  Ⓛ
ᯓ .sad  Ⓛ
ᯓ .sound <sound1 - sound119>  Ⓛ
ᯓ .soundmeme  Ⓛ
ᯓ .mikutalk <teks>  Ⓛ
ᯓ ..tts jokowi  Ⓛ
ᯓ ..tts prabowo  Ⓛ
ᯓ ..tts megawati  Ⓛ
ᯓ .ttsai <model/random/list> | <teks>  Ⓛ
╰–––––––––––––––༓
  `.trim())
}
handler.command = /^menuaudio$/i
handler.help = ["menuadio"]
handler.tags = ["main"]
export default handler