const searchBtn = document.getElementById('search-btn');
const queryInput = document.getElementById('query');
const resultsDiv = document.getElementById('results');

// Un catálogo local para comprobar que tu interfaz y tu lógica pinten las canciones perfectamente
const cancionesLocales = [
    "Verano traidor",
    "Mana - En el muelle de San Blas",
    "Mana - Clavado en un bar",
    "Canción de prueba 1",
    "Música para programar",
    "Lo-Fi Beats Sin Anuncios"
];

searchBtn.addEventListener('click', () => {
    const query = queryInput.value.trim().toLowerCase();
    if (!query) return;
    
    resultsDiv.innerHTML = '<p style="text-align:center;">Filtrando catálogo...</p>';
    
    // Buscamos dentro de nuestra lista local sin usar internet ni servidores externos
    const resultados = cancionesLocales.filter(cancion => cancion.toLowerCase().includes(query));
    
    // Le damos un pequeño retraso de medio segundo para simular una carga real
    setTimeout(() => {
        resultsDiv.innerHTML = '';
        
        if (resultados.length === 0) {
            resultsDiv.innerHTML = '<p style="text-align:center;">No se encontraron coincidencias locales.</p>';
            return;
        }
        
        resultados.forEach(item => {
            const div = document.createElement('div');
            div.className = 'song-item';
            div.style.padding = '15px';
            div.style.borderBottom = '1px solid #282828';
            div.style.cursor = 'pointer';
            div.textContent = '🎵 ' + item;
            
            // Simulación al tocar la canción
            div.addEventListener('click', () => {
                alert('¡Felicidades! Has programado la lógica de selección para: ' + item);
            });
            
            resultsDiv.appendChild(div);
        });
    }, 500);
});
