//Some howler variables
let songVolume = 0.5;
let howler;


//Equalizer
//Get the audio context for the analyzer and get the number of samples
let analyser;
let bufferLength;
let dataArray;

//Get the canvas and the context to use the equalizer
let canvas = document.getElementById('equalizer');
let ctx = canvas.getContext('2d');


//Loading Songs
const loadSongs = async () => {
    let response = await fetch('./scripts/songsData.json')
    songs = await response.json();
    howler = new Howl({
        src: [songs[i].src],
        volume: songVolume
    });

    //Falta el tratamiento de las propiedades de la canción y toda la creación de la radio. Falta la creación y gestión de la lista de reproducción

    //Equilizer
    analyser = Howler.ctx.createAnalyser();    //Proporciona acceso a la frecuencia y los datos de tiempo del audio que está siendo reproducido. 
    bufferLength = analyser.frequencyBinCount; //Indica el número de muestras de datos que se obtendrán del audio.
    dataArray = new Uint8Array(bufferLength);
    loadEqualizer();
    animateEqualizer();
}





function loadEqualizer() {
    // Conexion del masterGain (el volumen maestro de Howler.js) con el analyzer, permitiendo que el ecualizador recoja datos del audio que se está reproduciendo.
    Howler.masterGain.connect(analyser);

    // Conecta analyzer en el destino de audio. El audio sigue reproduciéndose en los altavoces o auriculares mientras se analiza
    analyser.connect(Howler.ctx.destination);

    // Coloca la frecuencia de muestreo. Obtiene un equilibrio entre la resolución temporal y la precisión de la frecuencia.
    analyser.fftSize = 2048;

    // Se utiliza para obtener los datos de forma de onda del audio en tiempo real, lo que se conoce como datos de dominio temporal. Devuelve la representación de la señal de audio en el dominio del tiempo, es decir, cómo varía la amplitud del sonido a lo largo del tiempo.
    analyser.getByteTimeDomainData(dataArray);
}


function animateEqualizer() {

    // Limpia el lienzo del canvas para pintar de nuevo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Obtiene los datos de frecuencia del audio. Cada valor del arreglo representa la amplitud de una frecuencia específica del espectro de audio, que luego se usa para dibujar las barras.
    analyser.getByteFrequencyData(dataArray);

    // Dibuja las barras del ecualizador
    let barWidth = (canvas.width / bufferLength) * 10;
    let barSpacing = 4;
    let barHeight;

    // Recorre el array de datos de frecuencia y dibuja las barras
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        let x = i * (barWidth + barSpacing);
        let y = canvas.height - barHeight;

        ctx.fillStyle = 'blue'; // Cambia el color de las barras según tu preferencia
        //Pinta la barra actual
        ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Repite la animación
    animationFrame = requestAnimationFrame(animateEqualizer);
}


// On Load
loadSongs();