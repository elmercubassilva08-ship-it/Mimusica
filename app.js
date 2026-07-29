<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Música</title>
    <style>
        /* Estilos visuales integrados para el diseño oscuro y verde */
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .app-container {
            max-width: 500px;
            margin: 0 auto;
        }
        h2 {
            color: #1DB954;
            text-align: center;
        }
        .search-box {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        #inputBuscar {
            flex: 1;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #333;
            background-color: #282828;
            color: white;
        }
        #btnBuscar {
            background-color: #1DB954;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .songs-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 120px;
        }
        .song-item {
            display: flex;
            align-items: center;
            background-color: #181818;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .song-item:hover {
            background-color: #282828;
        }
        .song-cover {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            margin-right: 15px;
        }
        .song-info {
            display: flex;
            flex-direction: column;
        }
        .song-title {
            font-weight: bold;
            font-size: 14px;
        }
        .song-artist {
            color: #b3b3b3;
            font-size: 12px;
            margin-top: 4px;
        }
        .player-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #282828;
            padding: 15px;
            text-align: center;
            border-top: 1px solid #1DB954;
        }
        #textoReproduciendo {
            color: #1DB954;
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: bold;
        }
        audio {
            width: 100%;
            max-width: 400px;
        }
        .mensaje {
            text-align: center;
            color: #b3b3b3;
        }
    </style>
</head>
<body>

    <div class="app-container">
        <h2>🎵 Mi Música</h2>
        
        <div class="search-box">
            <input type="text" id="inputBuscar" placeholder="Buscar artista o canción..." value="Maná">
            <button id="btnBuscar">Buscar</button>
        </div>

        <div id="listaCanciones" class="songs-list"></div>

        <div class="player-footer">
            <p id="textoReproduciendo">Ninguna canción seleccionada</p>
            <audio id="reproductorAudio" controls autoplay></audio>
        </div>
    </div>

    <!-- Enlace al archivo de lógica -->
    <script src="script.js"></script>
</body>
</html>
            
