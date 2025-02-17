/**
 * Membatasi panjang teks hingga jumlah karakter tertentu.
 * Jika teks lebih panjang dari batas, akan ditambahkan suffix (default: '...').
 * @param {string} value - Teks yang akan diproses.
 * @param {number} max - Batas maksimal panjang teks. Jika -1, teks tidak akan dipotong.
 * @param {string} suffix - Teks tambahan jika teks dipotong (default: '...').
 * @returns {string} - Teks yang telah diproses.
 */
export const limitText = (value, max = -1, suffix = '...') => {
    if (max === -1) {
        return value;
    }

    return value.length > max ? value.substring(0, max) + ' ' + suffix : value;
};

/**
 * Memformat tanggal menjadi format lokal Indonesia (DD/MM/YYYY).
 * @param {string|Date} date - Tanggal dalam format string atau objek Date.
 * @returns {string} - Tanggal yang telah diformat.
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID");
};

/**
 * Memformat tanggal dan waktu menjadi format lokal Indonesia (DD/MM/YYYY, HH:MM).
 * Format menggunakan 24 jam tanpa AM/PM.
 * @param {string|Date} date - Tanggal dalam format string atau objek Date.
 * @returns {string} - Tanggal dan waktu yang telah diformat.
 */
export const formatDateWithTime = (date) => {
    return new Date(date).toLocaleString("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).replace(".", ":");
};

/**
 * Memformat angka menjadi format mata uang Rupiah (IDR).
 * @param {number} value - Angka yang akan diformat.
 * @returns {string} - String dalam format mata uang Rupiah.
 */
export const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(value);
};

/**
 * Mengembalikan label pembayaran berdasarkan tipe transaksi.
 * @param {string} type - Tipe pembayaran ('paid-off' atau 'debt').
 * @returns {string} - Label dalam bahasa Indonesia.
 */
export const transactionPaymentType = (type) => {
    switch (type) {
        case 'paid-off':
            return 'Lunas';
        case 'debt':
            return 'Hutang';
        default:
            return 'Tidak Diketahui'; // Menangani tipe yang tidak dikenali
    }
};

/**
 * Mengembalikan label jenis pelanggan berdasarkan tipe pelanggan.
 * @param {string} type - Tipe pelanggan ('general' atau 'medical').
 * @returns {string} - Label dalam bahasa Indonesia.
 */
export const transactionCustomerType = (type) => {
    switch (type) {
        case 'general':
            return 'Umum';
        case 'medical':
            return 'Medis';
        default:
            return 'Lainnya';
    }
};

/**
 * Mengembalikan label kategori produk berdasarkan kode kategori.
 * @param {string} category - Kategori produk ('obat' atau 'bhp').
 * @returns {string} - Label dalam bahasa Indonesia.
 */
export const productGroupCategory = (category) => {
    switch (category) {
        case 'obat':
            return 'Obat';
        case 'bhp':
            return 'BHP';
        default:
            return 'Lainnya';
    }
};

