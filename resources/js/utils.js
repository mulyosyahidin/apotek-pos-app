export const limitText = (value, max = -1, suffix = '...') => {
    if (max === -1) {
        return value;
    }

    return value.length > max ? value.substring(0, max) + ' ' + suffix : value;
}

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID");
}

export const formatDateWithTime = (date) => {
    return new Date(date).toLocaleString("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).replace(".", ":");
}

export const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}
