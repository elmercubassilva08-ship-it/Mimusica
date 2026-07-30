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
    
    contenedor.innerHTML = "<p class='mensaje'>Buscando archivos de audio MP3...</p>";

    try {
        // Conexión directa a un motor indexador de archivos MP3 de código abierto
        const urlApi = "https://freemusicarchive.org" + encodeURIComponent(termino) + "&limit=8";
        const respuesta = await fetch(urlApi);
        const datos = await respuesta.json();
        
        contenedor.innerHTML = ""; 
        
        if (!datos.aRows || datos.aRows.length === 0) {
            contenedor.innerHTML = "<p class='mensaje'>No se encontraron archivos de sonido. Intenta con otro término.</p>";
            return;
        }
        
        // Listar los archivos MP3 encontrados en la pantalla
        datos.aRows.forEach(cancion => {
            const item = document.createElement('div');
            item.className = 'track-item';
            
            // Limpiar etiquetas HTML que a veces trae el buscador del servidor
            const tituloLimpio = cancion.track_title.replace(/<\/?[^>]+(>|$)/g, "");
            const artistaLimpio = cancion.artist_name.replace(/<\/?[^>]+(>|$)/g, "");
            
            item.innerHTML = `
                <div class="track-info">
                    <div class="track-title">${tituloLimpio}</div>
                    <div class="track-duration">${artistaLimpio}</div>
                </div>
            `;
            
            // Al hacer clic, alimenta el enlace .mp3 directo al reproductor nativo
            item.onclick = () => {
                const reproductor = document.getElementById('reproductor');
                const nowPlaying = document.getElementById('now-playing');
                
                nowPlaying.innerText = "Reproduciendo MP3: " + tituloLimpio;
                
                // Enlace directo del flujo del archivo .mp3 sin reproductores embebidos inestables
                reproductor.src = cancion.track_listen_url;
                reproductor.play();
            };
            
            contenedor.appendChild(item);
        });
    } catch (error) {
        // Plan de contingencia si el servidor principal está ocupado: usa base de datos Jamendo MP3 masiva
        try {
            const urlRespaldo = "https://jamendo.com" + encodeURIComponent(termino);
            const resRespaldo = await fetch(urlRespaldo);
            const datosRespaldo = await resRespaldo.json();
            
            contenedor.innerHTML = "";
            
            if(!datosRespaldo.results || datosRespaldo.results.length === 0) {
                contenedor.innerHTML = "<p class='mensaje'>Sin resultados de audio.</p>";
                return;
            }
            
            datosRespaldo.results.forEach(cancion => {
                const item = document.createElement('div');
                item.className = 'track-item';
                item.innerHTML = `
                    <div class="track-info">
                        <div class="track-title">${cancion.name}</div>
                        <div class="track-duration">${cancion.artist_name}</div>
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
        } catch(e) {
            contenedor.innerHTML = "<p class='mensaje' style='color:#ff4444;'>Error de red. Intenta buscar de nuevo.</p>";
            console.error(e);
        }
    }
}
