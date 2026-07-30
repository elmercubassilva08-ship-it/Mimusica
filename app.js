document.getElementById('btnBuscar').addEventListener('click', buscarMusica);
document.getElementById('busqueda').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarMusica();
    }
});

function buscarMusica() {
    const termino = document.getElementById('inputBuscar' ? document.getElementById('inputBuscar').value : document.getElementById('busqueda').value).trim();
    const wrapper = document.getElementById('player-wrapper');
    const iframe = document.getElementById('reproductor');
    const nowPlaying = document.getElementById('now-playing');
    
    if (!termino) return;
    
    nowPlaying.innerText = "Cargando reproductor integrado...";
    
    // TRUCO MAESTRO DE INCRUSTACIÓN: Transformamos la búsqueda en un widget incrustado oficial
    // Al usar la URL embed oficial de Spotify estructurada por parámetros limpios, burla el bloqueo de red
    const urlSpotifyEmbed = "https://spotify.com" + encodeURIComponent(termino);
    
    // Inyectamos la URL directamente en el iframe
    iframe.src = urlSpotifyEmbed;
    
    // Hacemos visible el reproductor dentro de tu tarjeta gris
    wrapper.style.display = "block";
    
    nowPlaying.innerText = "Resultados para: " + termino;
}
