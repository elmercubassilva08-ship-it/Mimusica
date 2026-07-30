document.getElementById('btnBuscar').addEventListener('click', buscarMusica);
document.getElementById('busqueda').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarMusica();
    }
});

async function buscarMusica() {
    const termino = document.getElementById('busqueda').value.trim();
    const contenedor = document.getElementById('resultados');
    if(!termino) return;
    
    contenedor.innerHTML = "<p class='mensaje'>Buscando pista de audio MP3...</p>";

    try {
        // Conexión directa a una API de Jamendo estable que provee streams directos sin bloqueos CORS
        const clientId = '56d30c55';
        const urlApi = `https://jamendo.com{clientId}&format=json&limit=10&search=${encodeURIComponent(termino)}`;
        
        const respuesta = await fetch(urlApi);
        const datos = await respuesta.json();
        
        contenedor.innerHTML = ""; 
        
        if (!datos.results || datos.results.length === 0) {
            contenedor.innerHTML = "<p class='mensaje'>No se encontraron canciones libres. Intentando motor secundario comercial...</p>";
            buscarEnServidorAlternativo(termino);
            return;
        }
        
        renderizarCanciones(datos.results);
        
    } catch (error) {
        buscarEnServidorAlternativo(termino);
    }
}

function renderizarCanciones(canciones) {
    const contenedor = document.getElementById('resultados');
    canciones.forEach(cancion => {
        const item = document.createElement('div');
        item.className = 'track-item';
        
        item.innerHTML = `
            <div class="track-info">
                <div class="track-title">${cancion.name}</div>
                <div class="track-artist">${cancion.artist_name || 'Artista'}</div>
            </div>
        `;
        
        item.onclick = () => {
            const reproductor = document.getElementById('reproductor');
            document.getElementById('now-playing').innerText = "Reproduciendo MP3: " + cancion.name;
            reproductor.src = cancion.audio;
            reproductor.play();
        };
        
        contenedor.appendChild(item);
    });
}

async function buscarEnServidorAlternativo(termino) {
    const contenedor = document.getElementById('resultados');
    try {
        // Motor de respaldo libre de restricciones cruzadas para GitHub
        const urlBackup = `https://deezer.com{encodeURIComponent(termino)}&output=jsonp`;
        
        // Creamos un script dinámico para evadir por completo las restricciones de red de GitHub Pages
        const script = document.createElement('script');
        script.src = `${urlBackup}&callback=procesarDeezer`;
        document.body.appendChild(script);
    } catch (e) {
        contenedor.innerHTML = "<p class='mensaje' style='color:#ff4444;'>Error en la red. Inténtalo de nuevo.</p>";
    }
}

// Procesador global para los resultados del servidor comercial de respaldo
window.procesarDeezer = function(datos) {
    const contenedor = document.getElementById('resultados');
    contenedor.innerHTML = "";
    
    if(!datos.data || datos.data.length === 0) {
        contenedor.innerHTML = "<p class='mensaje'>No se encontraron resultados comerciales.</p>";
        return;
    }
    
    datos.data.slice(0, 8).forEach(cancion => {
        const item = document.createElement('div');
        item.className = 'track-item';
        item.innerHTML = `
            <div class="track-info">
                <div class="track-title">${cancion.title}</div>
                <div class="track-artist">${cancion.artist.name} (Preview MP3)</div>
            </div>
        `;
        item.onclick = () => {
            const reproductor = document.getElementById('reproductor');
            document.getElementById('now-playing').innerText = "Reproduciendo: " + cancion.title;
            reproductor.src = cancion.preview; // Stream directo de audio MP3 sin anuncios
            reproductor.play();
        };
        contenedor.appendChild(item);
    });
};
