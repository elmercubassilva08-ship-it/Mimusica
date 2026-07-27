let player;
const searchBtn = document.getElementById('search-btn');
const queryInput = document.getElementById('query');
const resultsDiv = document.getElementById('results');
const currentTitle = document.getElementById('current-title');
const pausePlayBtn = document.getElementById('btn-pause-play');

// Creamos un elemento de audio nativo para reproducir los streams directos
const audio = new Audio();

searchBtn.addEventListener('click', searchMusic);
queryInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchMusic(); });

pausePlayBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        pausePlayBtn.textContent = 'Pausar';
    } else {
        audio.pause();
        pausePlayBtn.textContent = 'Reproducir';
    }
});

// Lógica para buscar canciones reales en línea usando la API libre de Deezer
async function searchMusic() {
    const query = queryInput.value.trim();
    if (!query) return;

    resultsDiv.innerHTML = '<p style="text-align:center;">Buscando canciones en línea...</p>';

    try {
        // Consultamos la API musical abierta a través de un proxy libre de bloqueos CORS
        const response = await fetch(`https://allorigins.win{encodeURIComponent(`https://deezer.com{query}`)}`);
        const data = await response.json();
        const json = JSON.parse(data.contents);
        const songs = json.data || [];

        resultsDiv.innerHTML = '';
        if (songs.length === 0) {
            resultsDiv.innerHTML = '<p style="text-align:center;">No se encontraron resultados.</p>';
            return;
        }

        // Desplegamos la lista de canciones con sus portadas reales
        songs.slice(0, 10).forEach((song) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            
            songItem.innerHTML = `
                <img src="${song.album.cover_small}" alt="Portada" style="width:50px; height:50px; border-radius:4px; margin-right:15px;">
                <div class="song-info">
                    <div class="song-title" style="font-weight:bold; font-size:14px;">${song.title}</div>
                    <div class="song-author" style="color:#b3b3b3; font-size:12px;">${song.artist.name}</div>
                </div>
            `;
            
            // Al hacer clic, reproducimos el stream de audio limpio de inmediato
            songItem.addEventListener('click', () => {
                currentTitle.textContent = `Cargando: ${song.title} - ${song.artist.name}`;
                audio.src = song.preview; // Stream de audio oficial directo sin anuncios
                audio.play();
                currentTitle.textContent = `Reproduciendo: ${song.title}`;
                pausePlayBtn.textContent = 'Pausar';
            });
            
            resultsDiv.appendChild(songItem);
        });
    } catch (error) {
        resultsDiv.innerHTML = '<p style="text-align:center;">Error de conexión con el catálogo. Intenta de nuevo.</p>';
    }
}
