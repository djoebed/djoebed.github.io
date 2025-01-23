let daftarBarang = [];

// Saat halaman dimuat, ambil filter dan daftarBarang yang disimpan dari localStorage (jika ada)
document.addEventListener('DOMContentLoaded', function () {
    const savedFilter = localStorage.getItem('filterKategori');
    const savedDaftarBarang = localStorage.getItem('daftarBarang');

    if (savedFilter) {
        document.getElementById('filterKategori').value = savedFilter;
    }

    if (savedDaftarBarang) {
        daftarBarang = JSON.parse(savedDaftarBarang);
    }

    tampilkanDaftarBarang(); // Tampilkan daftar yang difilter saat halaman dimuat
});

// Deteksi tombol Enter di input barang
document.getElementById('namaBarang').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Mencegah form submit
        tambahBarang(); // Panggil fungsi tambahBarang saat Enter ditekan
    }
});

function tambahBarang() {
    const namaBarang = document.getElementById('namaBarang').value.trim();
    const kategoriBarang = document.getElementById('kategoriBarang').value;

    // Validasi Nama Barang
    if (!namaBarang) {
        alert('Nama barang tidak boleh kosong');
        return;
    }
    if (namaBarang.length < 3) {
        alert('Nama barang harus terdiri dari minimal 3 karakter');
        return;
    }

    // Validasi Kategori Barang
    if (!kategoriBarang || kategoriBarang === 'Pilih Kategori') {
        alert('Silakan pilih kategori barang');
        return;
    }

    // Jika semua validasi lulus, tambahkan barang ke daftar
    const barang = {
        nama: namaBarang,
        kategori: kategoriBarang,
        tersewa: false,
        tanggalSewa: null // Tanggal sewa ditambahkan nanti saat disewa
    };

    daftarBarang.push(barang);
    simpanDaftarBarang(); // Simpan ke localStorage
    document.getElementById('namaBarang').value = '';
    document.getElementById('kategoriBarang').value = 'Pilih Kategori';
    tampilkanDaftarBarang();
}

function tampilkanDaftarBarang() {
    const ul = document.getElementById('daftarBarang');
    ul.innerHTML = '';

    const filterKategori = document.getElementById('filterKategori').value; // Ambil nilai filter kategori

    daftarBarang.forEach((barang, index) => {
        // Cek apakah barang sesuai dengan filter kategori
        if (filterKategori === 'Semua' || barang.kategori === filterKategori) {
            // Membuat elemen <li>
            const li = document.createElement('li');
            li.className = barang.tersewa ? 'tersewa' : '';
            li.textContent = `${barang.nama} - (${barang.kategori})`;

            if (barang.tanggalSewa) {
                li.textContent += ` - Tanggal Sewa: ${barang.tanggalSewa}`;
            }

            // Membuat grup tombol
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';

            // Tombol Sewa/Dikembalikan
            const sewaButton = document.createElement('button');
            sewaButton.textContent = barang.tersewa ? 'Dikembalikan' : 'Sewa';
            sewaButton.onclick = () => toggleSewa(index);

            // Tombol Edit
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editBarang(index);

            // Tombol Hapus
            const hapusButton = document.createElement('button');
            hapusButton.textContent = 'Hapus';
            hapusButton.onclick = () => hapusBarang(index);

            // Tambahkan tombol ke grup
            buttonGroup.appendChild(sewaButton);
            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(hapusButton);

            // Tambahkan grup tombol ke <li>
            li.appendChild(buttonGroup);
            ul.appendChild(li);
        }
    });
}

function toggleSewa(index) {
    const barang = daftarBarang[index];
    const li = document.querySelectorAll('li')[index]; // Ambil elemen <li> sesuai index
    const sewaButton = li.querySelector('button'); // Ambil tombol dalam <li> tersebut

    if (!barang.tersewa) {
        // Buat elemen input tanggal secara dinamis
        const tanggalInput = document.createElement('input');
        tanggalInput.type = 'text';
        tanggalInput.id = 'tanggalSewaPicker';
        tanggalInput.style.display = 'none'; // Sembunyikan input asli

        // Tambahkan input ke DOM sementara
        document.body.appendChild(tanggalInput);

        // Inisialisasi Flatpickr
        flatpickr(tanggalInput, {
            enableTime: false,
            dateFormat: "Y-m-d",
            defaultDate: new Date(),
            onClose: (selectedDates, dateStr) => {
                if (dateStr) {
                    barang.tanggalSewa = dateStr; // Simpan tanggal sewa
                    barang.tersewa = true; // Tandai barang sebagai tersewa
                    sewaButton.classList.add('tersewa'); // Tambahkan kelas 'tersewa' ke tombol
                    simpanDaftarBarang(); // Simpan ke localStorage
                    tampilkanDaftarBarang(); // Update tampilan daftar barang
                }
                tanggalInput.remove(); // Hapus elemen input setelah selesai
            },
        });

        // Buka kalender saat elemen dibuat
        tanggalInput.click();
    } else {
        // Kembalikan barang, hapus tanggal sewa dan hapus kelas 'tersewa' dari tombol
        barang.tanggalSewa = null;
        barang.tersewa = false;
        sewaButton.classList.remove('tersewa'); // Hapus kelas 'tersewa' dari tombol
        simpanDaftarBarang(); // Simpan ke localStorage
        tampilkanDaftarBarang(); // Update tampilan daftar barang
    }
}

function editBarang(index) {
    const namaBaru = prompt('Edit nama barang:', daftarBarang[index].nama);
    
    if (namaBaru !== null) {
        const trimmedNamaBaru = namaBaru.trim();
        
        if (trimmedNamaBaru === '') {
            alert('Nama barang tidak boleh kosong.');
            return;
        }
        if (trimmedNamaBaru.length < 3) {
            alert('Nama barang harus terdiri dari minimal 3 karakter.');
            return;
        }

        daftarBarang[index].nama = trimmedNamaBaru;
        simpanDaftarBarang(); // Simpan ke localStorage
        tampilkanDaftarBarang();
    }
}

function hapusBarang(index) {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        daftarBarang.splice(index, 1);
        simpanDaftarBarang(); // Simpan ke localStorage
        tampilkanDaftarBarang();
    }
}

function simpanDaftarBarang() {
    localStorage.setItem('daftarBarang', JSON.stringify(daftarBarang));
}
