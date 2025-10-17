import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  if (!args[0]) throw '⚠️ Masukkan link MediaFire!\n\nContoh: .mediafire https://www.mediafire.com/file/xxxxx/file'

  try {
    m.reply('🍬 Cihuyy otw ambil file dari MediaFire...')

    let apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/mediafire?url=${encodeURIComponent(args[0])}`
    let res = await fetch(apiUrl)
    let json = await res.json()

    if (!json.status) throw '❌ Gagal mengambil data dari API.'

    let result = json.result
    let filename = result.fileName || 'file.zip'
    let filesize = result.fileSize || 'Unknown'
    let mimetype = result.fileType || 'application/zip'
    let uploaded = result.uploaded || '-'
    let downloadUrl = result.url

    if (!downloadUrl) throw '❌ Link download tidak ditemukan di response API.'

    let fileRes = await fetch(downloadUrl)
    let buffer = await fileRes.buffer()

    let caption = `
⟦ MEDIAFIRE DOWNLOADER ⟧

📂 Nama   : ${filename}
📦 Ukuran : ${filesize}
📌 Tipe   : ${mimetype}
⏰ Upload : ${uploaded}
`

    await conn.sendMessage(
      m.chat,
      {
        document: buffer,
        fileName: filename,
        mimetype: 'application/zip',
        caption
      },
      { quoted: m }
    )
  } catch (e) {
    console.error(e)
    throw '❌ Terjadi kesalahan saat download MediaFire.'
  }
}

handler.help = ['mediafire <url>']
handler.tags = ['downloader']
handler.command = /^(mediafire|mf)$/i
handler.limit = true

export default handler