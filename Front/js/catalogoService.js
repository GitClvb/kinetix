// Responsabilidad: gestionar colores y categorías.
// HOY usa localStorage despues solo cambiamosa los métodos fetch

const STORAGE_KEY_CATEGORIAS = "kf_categorias";
const STORAGE_KEY_COLORES     = "kf_colores";

//Datos prueba
const CATEGORIAS_SEED = [
    { id: 1, nombre: "Playeras" },
    { id: 2, nombre: "Shorts" },
    { id: 3, nombre: "Pants" },
    { id: 4, nombre: "Sudaderas" },
    { id: 5, nombre: "Leggings" }
];

const COLORES_SEED = [
    { id: 1, nombre: "Negro",        codigo: "#1C1C1C" },
    { id: 2, nombre: "Blanco",       codigo: "#FFFFFF" },
    { id: 3, nombre: "Gris Oxford",  codigo: "#4A4A4A" },
    { id: 4, nombre: "Gris Claro",   codigo: "#B0B0B0" },
    { id: 5, nombre: "Azul Marino",  codigo: "#1A2A4A" },
    { id: 6, nombre: "Azul Rey",     codigo: "#0039A6" },
    { id: 7, nombre: "Rojo",         codigo: "#DC2626" },
    { id: 8, nombre: "Verde Militar",codigo: "#4B5320" }
];


function leerStorage(key, seed) {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    // Primera vez: guardamos los datos para que persista
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
}

function escribirStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

//categoria
export function getCategorias() {
    // TODO (backend): return fetch('/api/categorias').then(r => r.json());
    return leerStorage(STORAGE_KEY_CATEGORIAS, CATEGORIAS_SEED);
}

export function agregarCategoria(nombre) {
    // back: return fetch('/api/categorias', { method:'POST', body: JSON.stringify({nombre}) }).then(r => r.json());
    const lista = getCategorias();
    const nueva = { id: Date.now(), nombre };   // El id lo dará el servidor cuando haya backend
    lista.push(nueva);
    escribirStorage(STORAGE_KEY_CATEGORIAS, lista);
    return nueva;
}

// colores
export function getColores() {
    // back: return fetch('/api/colores').then(r => r.json());
    return leerStorage(STORAGE_KEY_COLORES, COLORES_SEED);
}

export function agregarColor(nombre, codigo) {
    // back: return fetch('/api/colores', { method:'POST', body: JSON.stringify({nombre, codigo}) }).then(r => r.json());
    const lista = getColores();
    const nuevo = { id: Date.now(), nombre, codigo };
    lista.push(nuevo);
    escribirStorage(STORAGE_KEY_COLORES, lista);
    return nuevo;
}

export function getColorById(id) {
    return getColores().find(c => c.id === Number(id)) || null;
}