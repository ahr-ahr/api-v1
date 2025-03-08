# Media Downloader API

API untuk mengunduh video dan audio dari berbagai platform media sosial seperti **TikTok**, **Instagram**, **YouTube**, dan **Spotify**. API ini memungkinkan pengguna untuk mendapatkan media dari URL yang diberikan dan menyediakan link unduhan untuk video dan audio.

## Fitur
- **TikTok**: Unduh video TikTok.
- **Instagram**: Unduh foto dan video Instagram.
- **YouTube**: Unduh video YouTube.
- **Spotify**: Unduh lagu dari Spotify.

## Teknologi yang Digunakan
- **Node.js**: Server backend.
- **Express.js**: Web framework untuk API.
- **Axios**: HTTP client untuk membuat request ke API eksternal.
- **Jest**: Framework untuk testing unit.
- **Spotify URL Info**, **ytdl-core**, **instagram-url-direct**: Libraries untuk mendownload media.

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan API ini secara lokal:

### 1. Clone Repository

```bash
git clone https://github.com/username/media-downloader-api.git
cd media-downloader-api
```

### 2. Install Dependencies

Install dependencies yang diperlukan menggunakan npm:

```bash
npm install
```

### 3. Menjalankan Aplikasi

Untuk menjalankan aplikasi secara lokal dalam mode pengembangan (development):

```bash
npm run dev
```

Untuk menjalankan aplikasi di mode produksi:

```bash
npm start
```

API akan berjalan di `http://localhost:5000`.

### 4. Menjalankan Testing

Untuk menjalankan unit test menggunakan Jest, gunakan perintah:

```bash
npm test
```

## Endpoints

### 1. **Download dari TikTok**

**Endpoint**: `/download/tiktok`

**Metode**: `GET`

**Parameter**:  
- `url`: URL video TikTok yang ingin diunduh.

**Contoh Request**:
```
GET /download/tiktok?url=https://www.tiktok.com/@username/video/1234567890
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/downloaded-video.mp4"
  }
}
```

### 2. **Download dari Instagram**

**Endpoint**: `/download/instagram`

**Metode**: `GET`

**Parameter**:  
- `url`: URL foto atau video Instagram yang ingin diunduh.

**Contoh Request**:
```
GET /download/instagram?url=https://www.instagram.com/p/abcdefg/
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/downloaded-media.jpg"
  }
}
```

### 3. **Download dari YouTube**

**Endpoint**: `/download/youtube`

**Metode**: `GET`

**Parameter**:  
- `url`: URL video YouTube yang ingin diunduh.

**Contoh Request**:
```
GET /download/youtube?url=https://www.youtube.com/watch?v=exampleid
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/downloaded-video.mp4"
  }
}
```

### 4. **Download dari Spotify**

**Endpoint**: `/download/spotify`

**Metode**: `GET`

**Parameter**:  
- `url`: URL lagu atau album Spotify yang ingin diunduh.

**Contoh Request**:
```
GET /download/spotify?url=https://open.spotify.com/track/trackid
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/downloaded-song.mp3"
  }
}
```

## Pengujian

Untuk menjalankan pengujian unit, Anda dapat menggunakan framework Jest. Pengujian unit sudah disiapkan untuk memverifikasi apakah setiap layanan unduhan (TikTok, Instagram, YouTube, dan Spotify) berfungsi dengan baik.

Untuk menjalankan pengujian:

```bash
npm test
```

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan buat *pull request* setelah melakukan perubahan yang diinginkan.

## Lisensi

Proyek ini menggunakan lisensi MIT - lihat [LICENSE](LICENSE) untuk detailnya.

## Penulis

- **Nama**: Ahmad Haikal Rizal
- **Email**: ahr2396@gmail.com

```