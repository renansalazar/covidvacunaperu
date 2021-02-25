export default function(text) {
    const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u',
                    'Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
    return text.split('').map( letra => acentos[letra] || letra).join('').toString().toUpperCase()
} 