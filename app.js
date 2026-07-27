let player;
const searchBtn = document.getElementById('search-btn');
const queryInput = document.getElementById('query');
const resultsDiv = document.getElementById('results');
const currentTitle = document.getElementById('current-title');
const pausePlayBtn = document.getElementById('btn-pause-play');

// 1. Inicializa el reproductor incrustado cuando la API de YouTube esté lista
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '1', width: '1', videoId: '',
        playerVars: {
            'playsinline': 1, 'autoplay': 1, 'controls': 0,
            'rel': 0, 'showinfo': 0, 'modestbranding': 1, 'iv_load_policy': 3
        }
    });
};

searchBtn.addEventListener('click', searchMusic);
queryInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchMusic(); });

pausePlayBtn.addEventListener('click', () => {
    if (!player) return;
    const state = player.getPlayerState();
    if (state === 1) { player.pauseVideo(); pausePlayBtn.textContent = 'Reproducir'; } 
    else { player.playVideo(); pausePlayBtn.textContent = 'Pausar'; }
});

// 2. Lógica para buscar canciones en la base de datos global
async function searchMusic() {
    const query = queryInput.value.trim();
    if (!query) return;

    resultsDiv.innerHTML = '<p style="text-align:center;">Buscando música en línea...</p>';

    try {
        // Consultamos un proxy de sugerencias abierto que no bloquea la seguridad web
        const response = await fetch(`https://google.com{encodeURIComponent(query)}`);
        const text = await response.text();
        const cleanText = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
        const dataJson = JSON.parse(cleanText);
        const suggestions = dataJson[1] || [];

        resultsDiv.innerHTML = '';
        if (suggestions.length === 0) {
            resultsDiv.innerHTML = '<p style="text-align:center;">No se encontraron resultados.</p>';
            return;
        }

        // Listamos las mejores coincidencias en pantalla
        suggestions.slice(0, 6).forEach((item, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.style.padding = '15px';
            songItem.style.borderBottom = '1px solid #282828';
            songItem.style.cursor = 'pointer';
            songItem.innerHTML = `🎵 <strong>${item[0]}</strong> <br><small style="color:#b3b3b3;">Stream de audio #${index+1}</small>`;
            
            // 3. Al hacer clic, reproducimos el audio del video de manera directa
            songItem.addEventListener('click', () => {
                currentTitle.textContent = `Cargando stream para: ${item[0]}`;
                pausePlayBtn.textContent = 'Pausar';
                
                // Conectamos un iframe dinámico para mandar el audio directo sin anuncios
                player.loadVideoByUrl(`https://youtube.com{encodeURIComponent(item[0])}`);
                currentTitle.textContent = `Reproduciendo: ${item[0]}`;
            });
            resultsDiv.appendChild(songItem);
        });
    } catch (error) {
        resultsDiv.innerHTML = '<p style="text-align:center;">Error de conexión. Intenta escribir otro término.</p>';
    }
}
