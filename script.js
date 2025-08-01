// script.js

/**
 * Fungsi untuk memperbarui status "live" pada jadwal.
 * Ini akan menyorot acara yang sedang berlangsung, menambahkan indikator "LIVE",
 * memaparkan acara semasa di bahagian atas, dan memaparkan mesej tamat kejohanan
 * apabila semua acara telah selesai.
 */
function updateLiveStatus() {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    // Tetapkan tarikh acara sukan (16 Ogos 2025)
    const eventDay = 16;
    const eventMonth = 7; // Ogos adalah bulan ke-7 (indeks 0)
    const eventYear = 2025;

    const rows = document.querySelectorAll('#sportsDaySchedule tbody tr');
    const currentEventDisplay = document.getElementById('current-event-display');
    const currentEventTime = document.getElementById('current-event-time');
    const currentEventDetails = document.getElementById('current-event-details');
    const endMessageDisplay = document.getElementById('end-message-display');

    // Reset UI elements pada setiap kemas kini
    currentEventDisplay.classList.add('hidden'); // Sembunyikan paparan acara semasa
    endMessageDisplay.classList.add('hidden'); // Sembunyikan mesej tamat kejohanan
    let isEventLive = false; // Bendera untuk memeriksa jika ada acara yang sedang berlangsung

    // Hanya proses jika tarikh semasa adalah tarikh acara
    if (currentDay === eventDay && currentMonth === eventMonth && currentYear === eventYear) {
        rows.forEach(row => {
            // Hapus penyorotan dan indikator live dari semua baris terlebih dahulu
            row.classList.remove('highlight');
            const liveIndicator = row.querySelector('.live-indicator');
            if (liveIndicator) {
                liveIndicator.remove();
            }

            const startTime = row.dataset.start;
            const endTime = row.dataset.end;

            if (startTime && endTime) {
                const [startH, startM] = startTime.split(':').map(Number);
                const [endH, endM] = endTime.split(':').map(Number);

                const startTimeInMinutes = startH * 60 + startM;
                const endTimeInMinutes = endH * 60 + endM;

                // Periksa jika waktu semasa berada dalam rentang waktu acara
                if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
                    isEventLive = true; // Acara sedang berlangsung
                    row.classList.add('highlight'); // Sorot baris dalam jadual utama
                    const td = row.cells[1]; // Dapatkan sel kedua (kolom 'Acara')
                    const indicator = document.createElement('span');
                    indicator.className = 'live-indicator';
                    td.appendChild(indicator);

                    // Kemas kini dan paparkan div acara semasa di atas
                    currentEventTime.textContent = row.cells[0].textContent; // Salin masa
                    currentEventDetails.innerHTML = td.innerHTML; // Salin butiran acara (termasuk ul/li)
                    currentEventDisplay.classList.remove('hidden'); // Paparkan div acara semasa
                }
            }
        });

        // Jika tiada acara yang sedang berlangsung (isEventLive adalah false)
        // DAN waktu semasa telah melepasi waktu tamat acara terakhir
        const lastEventEndTimeInMinutes = 13 * 60 + 30; // 1.30 PM

        if (!isEventLive && currentTimeInMinutes > lastEventEndTimeInMinutes) {
            endMessageDisplay.classList.remove('hidden'); // Paparkan mesej tamat kejohanan
            document.getElementById('sportsDaySchedule').classList.add('hidden'); // Sembunyikan jadual utama
        } else {
            document.getElementById('sportsDaySchedule').classList.remove('hidden'); // Pastikan jadual utama dipaparkan
        }

    } else {
        // Jika bukan 16 Ogos 2025, pastikan tiada penunjuk live dan mesej tamat
        rows.forEach(row => {
            row.classList.remove('highlight');
            const liveIndicator = row.querySelector('.live-indicator');
            if (liveIndicator) {
                liveIndicator.remove();
            }
        });
        currentEventDisplay.classList.add('hidden');
        endMessageDisplay.classList.add('hidden');
        document.getElementById('sportsDaySchedule').classList.remove('hidden'); // Pastikan jadual utama dipaparkan
    }
}

// Perbarui status live setiap menit (60 * 1000 milidetik)
setInterval(updateLiveStatus, 60 * 1000);

// Panggil fungsi updateLiveStatus segera setelah halaman dimuat
// untuk memastikan status yang benar ditampilkan dari awal
updateLiveStatus();
