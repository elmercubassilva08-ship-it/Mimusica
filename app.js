document.getElementById('btnBuscar').addEventListener('click', buscarInterno);
document.getElementById('busqueda').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarInterno();
    }
});

function buscarInterno() {
    const termino = document.getElementById('busqueda').value.trim();
    const wrapper = document.getElementById('player-wrapper');
    const iframe = document.getElementById('reproductor');
    const nowPlaying = document.getElementById('now-playing');
    
    if (!termino) return;
    
    nowPlaying.innerText = "Conectando con la librería oficial...";
    
    // TRUCO TÉCNICO DEFINITIVO: Usamos la URL de incrustación de listas de reproducción de YouTube
    // Pasamos el término codificado de forma estricta usando variables separadas para que el navegador jamás las junte mal
    const dominioBase = "https://youtube.com";
    const parametros = "?listType=search&list=" + encodeURIComponent(termino) + "&autoplay=1&modestbranding=1&rel=0";
    
    // Fusionamos la dirección de forma limpia en una variable segura
    const urlFinal = dominioBase + parametros;
    
    // Inyectamos en el iframe y mostramos el reproductor en tu pantalla
    iframe.src = urlFinal;
    wrapper.style.display = "block";
    
    nowPlaying.innerText = "Reproduciendo éxitos de: " + termino;
}
