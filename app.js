// Referencias a los elementos del HTML
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const listaCanciones = document.getElementById('listaCanciones');
const reproductorAudio = document.getElementById('reproductorAudio');
const textoReproduciendo = document.getElementById('textoReproduciendo');

// Función principal para buscar música en internet usando una API proxy de Deezer
async function buscarMusica(termino) {
    if (!termino.trim()) return;

    // Limpiamos la lista y mostramos un mensaje de carga
    listaCanciones.innerHTML = '<p class="mensaje">Buscando...</p>';

    try {
        // Usamos un proxy público para evitar problemas de CORS al desarrollar en GitHub Pages
        const url = `https://corsproxy.io{encodeURIComponent(`https://deezer.com{termino}`)}`;
        
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        // Validamos si la API devolvió canciones
        if (!datos.data || datos.data.length === 0) {
            listaCanciones.innerHTML = '<p class="mensaje">No se encontraron resultados.</p>';
            return;
        }

        // Limpiamos el mensaje de carga para poner los resultados reales
        listaCanciones.innerHTML = '';

        // Recorremos las canciones encontradas (máximo 10 resultados)
        datos.data.slice(0, 10).forEach(cancion => {
            
            // Creamos el contenedor de la canción
            const tarjetaCancion = document.createElement('div');
            tarjetaCancion.className = 'song-item';
            
            // Insertamos la estructura con los datos reales obtenidos de internet
            tarjetaCancion.innerHTML = `
                <img src="${cancion.album.cover_medium}" alt="Portada de ${cancion.title}" class="song-cover">
                <div class="song-info">
                    <span class="song-title">${cancion.title}</span>
                    <span class="song-artist">${cancion.artist.name}</span>
                </div>
            `;

            // Evento: Al hacer clic en la canción, se reproduce en la barra inferior
            tarjetaCancion.addEventListener('click', () => {
                // cancion.preview contiene el enlace directo al archivo .mp3 de 30 segundos
                reproductorAudio.src = cancion.preview; 
                reproductorAudio.play();
                
                // Actualizamos el texto del reproductor inferior
                textoReproduciendo.textContent = `Escuchando: ${cancion.title} - ${cancion.artist.name}`;
            });

            // Agregamos la tarjeta a la lista visible en pantalla
            listaCanciones.appendChild(tarjetaCancion);
        });

    } catch (error) {
        console.error("Error al obtener la música:", error);
        listaCanciones.innerHTML = '<p class="mensaje" style="color: red;">Error de conexión. Inténtalo de nuevo.</p>';
    }
}

// Escuchar el clic en el botón de buscar
btnBuscar.addEventListener('click', () => {
    buscarMusica(inputBuscar.value);
});

// Escuchar la tecla "Enter" en el campo de texto
inputBuscar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarMusica(inputBuscar.value);
    }
});

// Cargar una búsqueda inicial al abrir la página (por ejemplo: Maná)
window.addEventListener('DOMContentLoaded', () => {
    buscarMusica('Maná');
});
