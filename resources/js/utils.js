export const limitText = (value, max = -1, suffix = '...') => {
    if (max === -1) {
        return value;
    }

    return value.length > max ? value.substring(0, max) + ' ' + suffix : value;
}

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
}

export const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}
