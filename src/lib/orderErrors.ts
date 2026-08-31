/** Maps API error codes from POST /api/orders to user-facing Indonesian messages. */
export function orderErrorMessage(err: unknown): string {
  const code = err instanceof Error ? err.message : String(err ?? '');
  switch (code) {
    case 'AMOUNT_MUST_INCREASE':
      return 'Bot tersebut sudah terdaftar dengan nominal yang sama atau lebih tinggi. Naikkan nominal sponsor kamu.';
    case 'RATE_LIMITED':
      return 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.';
    case 'VALIDATION_ERROR':
      return 'Data tidak valid. Username bot harus 5–32 karakter dan berakhiran "bot" (contoh: @NamaBot), nama judul wajib diisi, dan nominal minimal Rp1.000.';
    case 'PAYMENT_PROVIDER_UNAVAILABLE':
      return 'Gateway pembayaran sedang tidak merespons. Coba lagi beberapa saat.';
    case 'BACKEND_UNAVAILABLE':
      return 'Server sedang tidak tersedia. Coba lagi beberapa saat.';
    case 'PAYLOAD_TOO_LARGE':
      return 'Data terlalu besar. Pendekkan deskripsi bot kamu.';
    default:
      return `Order gagal dibuat (${code || 'UNKNOWN'}). Coba lagi.`;
  }
}

/** Client-side guard mirroring the server's username rule so users see the reason before submitting. */
export function usernameError(username: string): string {
  const clean = username.replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '').trim();
  if (!clean) {
    return 'Username bot wajib diisi.';
  }
  if (!/^[a-zA-Z0-9_]{5,32}$/.test(clean)) {
    return 'Username bot hanya boleh huruf, angka, dan garis bawah (_), panjang 5–32 karakter.';
  }
  if (!/bot$/i.test(clean)) {
    return 'Username bot harus berakhiran kata "bot" (contoh: @NamaBot atau @tools_bot) untuk memastikan ini adalah Bot Telegram, bukan grup/channel/pribadi.';
  }
  return '';
}
