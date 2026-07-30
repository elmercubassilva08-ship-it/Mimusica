document.getElementById('btnBuscar').addEventListener('click', buscarMusica);
document.getElementById('inputBuscar').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarMusica();
    }
});

async function buscarMusica() {
    const termino = document.getElementById('inputBuscar').value.trim();
    const lista = document.getElementById('listaCanciones');
    
    if (!termino) return;
    
    lista.innerHTML = '<p class="mensaje">Buscando canciones en la red global...</p>';

    try {
        // API pública basada en instancias libres de Invidious (sin restricciones de CORS para GitHub)
        const urlBusqueda = `https://io.lol{encodeURIComponent(termino)}&type=video`;
        
        const respuesta = await fetch(urlBusqueda);
        const resultados = await respuesta.json();
        
        lista.innerHTML = ""; 
        
        if (!resultados || resultados.length === 0) {
            lista.innerHTML = '<p class="mensaje">No se encontraron resultados para tu búsqueda.</p>';
            return;
        }
        
        // Mostrar los primeros 10 resultados encontrados
        resultados.slice(0, 10).forEach(cancion => {
            const item = document.createElement('div');
            item.className = 'song-item';
            
            // Obtener miniatura oficial del video musical
            let portada = 'https://picsum.photos';
            if (cancion.videoThumbnails && cancion.videoThumbnails.length > 0) {
                // Buscamos una miniatura con buena resolución de la lista
                const thumb = cancion.videoThumbnails.find(t => t.quality === 'default' || t.quality === 'medium') || cancion.videoThumbnails[0];
                portada = thumb.url;
            }

            item.innerHTML = `
                <img class="song-cover" src="${portada}" alt="Portada">
                <div class="song-info">
                    <div class="song-title">${cancion.title}</div>
                    <div class="song-artist">${cancion.author || 'Video Musical'}</div>
                </div>
            `;
            
            // Lógica al hacer clic en la canción
            item.onclick = async () => {
                const reproductor = document.getElementById('reproductorAudio');
                const texto = document.getElementById('textoReproduciendo');
                
                texto.innerText = "Cargando audio sin anuncios...";
                
                try {
                    // Consultar los flujos de datos multimedia directos del video
                    const resVideo = await fetch(`https://io.lol{cancion.videoId}`);
                    const datosVideo = await resVideo.json();
                    
                    // Extraer los formatos adaptativos que correspondan únicamente a audio para evitar videos y publicidad
                    if (datosVideo.adaptiveFormats && datosVideo.adaptiveFormats.length > 0) {
                        const audioStream = datosVideo.adaptiveFormats.find(format => format.type && format.type.includes('audio/'));
                        
                        if (audioStream && audioStream.url) {
                            texto.innerText = "Reproduciendo: " + cancion.title;
                            reproductor.src = audioStream.url;
                            reproductor.play();
                            return;
                        }
                    }
                    texto.innerText = "Esta pista no permite streaming directo. Intenta con otra.";
                } catch (err) {
                    texto.innerText = "Servidor ocupado. Intenta tocar otra opción de la lista.";
                    console.error(err);
                }
            };
            
            lista.appendChild(item);
        });
        
    } catch (error) {
        lista.innerHTML = '<p class="mensaje" style="color: #ff4444;">Error de red. Intenta buscar de nuevo en unos segundos.</p>';
        console.error(error);
    }
}
