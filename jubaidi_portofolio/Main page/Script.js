function showTime() {
    // Mendapatkan waktu saat ini dalam UTC
    const now = new Date();

    // Mengonversi waktu ke zona waktu Bangkok (UTC+7)
    const bangkokTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));

    // Menampilkan waktu di elemen HTML
    document.getElementById('currentTime').innerHTML = bangkokTime.toLocaleString();
}

showTime();
setInterval(function () {
    showTime();
}, 1000);