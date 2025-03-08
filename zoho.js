const puppeteer = require('puppeteer');

(async () => {
    // Membuka browser baru
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 }); // `slowMo` untuk memperlambat proses dan melihatnya
    const page = await browser.newPage();

    // Mengunjungi halaman login Zoho
    await page.goto('https://accounts.zoho.com/signin?servicename=AaaServer&serviceurl=https%3A%2F%2Faccounts.zoho.com%2Fhome', { waitUntil: 'domcontentloaded' });

    // Tunggu sampai elemen input email tersedia
    await page.waitForSelector('#login_id', { visible: true });

    // Mengetikkan email pada input form
    await page.type('#login_id', 'xixixix@gmail.com'); // Ganti dengan email Anda

    // Tunggu sebentar untuk melihat input email di form
    await page.waitForTimeout(1000); // Menunggu selama 1 detik, bisa disesuaikan

    // Menunggu tombol 'Next' dan klik
    await page.waitForSelector('#nextbtn', { visible: true });
    await page.click('#nextbtn'); // Klik tombol 'Next'

    // Tunggu sampai elemen password muncul
    await page.waitForSelector('#password', { visible: true }); // Mengantisipasi munculnya form password

    // Mengetikkan password pada input form
    await page.type('#password', 'your_password'); // Ganti dengan password Anda

    // Tunggu sebentar setelah mengetikkan password
    await page.waitForTimeout(1000); // Menunggu selama 1 detik, bisa disesuaikan

    // Menunggu tombol 'Sign In' dan klik untuk login
    await page.waitForSelector('#nextbtn', { visible: true });
    await page.click('#nextbtn'); // Klik tombol 'Sign In' setelah mengisi password

    // Tunggu sampai navigasi selesai atau halaman berubah
    await page.waitForNavigation({ waitUntil: 'load' }); // Tunggu halaman setelah klik 'Sign In'

    // Anda dapat menambahkan langkah selanjutnya jika diperlukan, seperti verifikasi login
    // Misalnya, menunggu elemen yang hanya muncul setelah login berhasil
    // await page.waitForSelector('#someElementAfterLogin', { visible: true });

    // Menjaga browser tetap terbuka untuk memverifikasi hasilnya
    // browser.close(); // Uncomment jika ingin menutup browser setelah selesai
})();
