# 🚀 Setup Guide untuk GitHub Profile README

Panduan lengkap untuk mengatur GitHub Profile README yang powerful dan menarik.

## 📋 Daftar Isi
- [Prerequisites](#prerequisites)
- [Setup GitHub Actions](#setup-github-actions)
- [Konfigurasi WakaTime](#konfigurasi-wakatime)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

1. **Repository Profile GitHub**
   - Buat repository dengan nama yang sama dengan username GitHub Anda
   - Repository harus public
   - Tambahkan file README.md

2. **GitHub Token**
   - Buka GitHub Settings > Developer settings > Personal access tokens
   - Generate token baru dengan scope: `repo`, `user`, `workflow`
   - Simpan token untuk digunakan nanti

## ⚙️ Setup GitHub Actions

### 1. Snake Animation Setup

File `.github/workflows/snake.yml` sudah dibuat. Untuk mengaktifkannya:

1. Pastikan repository Anda public
2. Aktifkan GitHub Actions di repository settings
3. Snake animation akan berjalan otomatis setiap 12 jam

### 2. WakaTime Stats Setup

1. **Daftar WakaTime**
   - Kunjungi [wakatime.com](https://wakatime.com)
   - Daftar akun gratis
   - Install plugin WakaTime di editor Anda (VS Code, etc.)

2. **Dapatkan API Key**
   - Login ke WakaTime dashboard
   - Buka Settings > API Key
   - Copy API key Anda

3. **Setup GitHub Secrets**
   - Buka repository settings > Secrets and variables > Actions
   - Tambahkan secrets berikut:
     - `WAKATIME_API_KEY`: API key dari WakaTime
     - `GH_TOKEN`: Personal access token GitHub Anda

## 🎨 Customization

### Mengubah Tema
Ganti parameter `theme` di URL stats:
- `tokyonight` (default)
- `radical`
- `merko`
- `gruvbox`
- `dark`
- `highcontrast`

### Mengubah Bahasa
Edit bagian typing animation untuk menggunakan bahasa lain:
```
lines=Hello!+I'm+Vicky;Frontend+Developer;Welcome+to+My+Profile!
```

### Menambah Skill Icons
Kunjungi [skillicons.dev](https://skillicons.dev) untuk melihat icon yang tersedia:
```
https://skillicons.dev/icons?i=js,ts,react,vue,nextjs
```

### Custom Colors
Ubah warna di berbagai komponen:
- Profile views: `&color=0e75b6`
- Snake animation: `&color_snake=orange`
- Stats cards: `&title_color=fff&text_color=fff`

## 🔍 Troubleshooting

### Snake Animation Tidak Muncul
1. Pastikan repository public
2. Cek GitHub Actions tab untuk error
3. Pastikan branch `output` sudah dibuat
4. Tunggu hingga workflow selesai (bisa 5-10 menit)

### WakaTime Stats Kosong
1. Pastikan API key benar
2. Pastikan sudah coding dengan WakaTime plugin aktif
3. Tunggu 24 jam untuk data pertama muncul
4. Cek logs di GitHub Actions

### Stats Card Error
1. Pastikan username GitHub benar
2. Cek apakah repository public
3. Tunggu beberapa menit untuk refresh cache

## 📊 Widget Tambahan

### GitHub Trophy
```markdown
![trophy](https://github-profile-trophy.vercel.app/?username=vickyymosafan&theme=tokyonight)
```

### Activity Graph
```markdown
![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=vickyymosafan&theme=tokyo-night)
```

### Spotify Now Playing
1. Setup Spotify Developer App
2. Gunakan [spotify-github-profile](https://github.com/kittinan/spotify-github-profile)

## 🎯 Tips & Best Practices

1. **Update Reguler**: Update informasi secara berkala
2. **Konsistensi Tema**: Gunakan tema yang konsisten di semua widget
3. **Performance**: Jangan terlalu banyak widget yang berat
4. **Mobile Friendly**: Pastikan tampilan bagus di mobile
5. **Personal Touch**: Tambahkan informasi personal yang menarik

## 🆘 Bantuan Lebih Lanjut

Jika mengalami masalah:
1. Cek [GitHub Community](https://github.community)
2. Baca dokumentasi resmi setiap widget
3. Lihat contoh profile README lainnya
4. Buka issue di repository ini

---

**Happy Coding!** 🚀✨
