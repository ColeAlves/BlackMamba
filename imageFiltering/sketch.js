let mic, fft;
var song;
var slider;
var img;

function preload(){
  song = loadSound("Crooked_Straight.mp3", loadedSong);
  
  img = loadImage("starrynight.jpg");

  
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
}

function setup() {
  createCanvas(710, 400);
  noFill();
  //song = loadSound("Crooked_Straight.mp3", loadedSong);
  //img = loadImage("starrynight.jpg");
  
  //Song and song analyzers
  //mic = new p5.AudioIn();
  //mic.start();
  fft = new p5.FFT();
  fft.setInput(song);
  slider = createSlider(0,1,0.5, 0.01);
  
  
  
}

function loadedSong(){
  print("hey");
  song.play();
}

function draw() {
  background(200);

  let spectrum = fft.analyze();

  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
  getLoudestFrequency();
  song.setVolume(slider.value());
  //image(img,0,0);
  
  
  /*let level = amplitude.getLevel();
  print("level is "+level);
  let size = map(level, 0, 1, 100, 300);
  ellipse(width/2, height/2, size, size);*/
  
img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    img.pixels[index + 0] = img.pixels[index + 0] + 5000;
    img.pixels[index + 1] = img.pixels[index + 1] ;
    img.pixels[index + 2] = img.pixels[index + 2];
    img.pixels[index + 3] = img.pixels[index + 3];
}
}
  
  img.updatePixels();
  //saveImage()
  image(img, 0, 0, width, height);
}
function getLoudestFrequency() {
    var nyquist = sampleRate() / 2; // 22050
    var spectrum = fft.analyze(); // array of amplitudes in bins
    var numberOfBins = spectrum.length;
    var maxAmp = 0;
    var largestBin;

    for (var i = 0; i < numberOfBins; i++) {
        var thisAmp = spectrum[i]; // amplitude of current bin
        if (thisAmp > maxAmp) {
            maxAmp = thisAmp;
            largestBin = i;
        }
    }

    var loudestFreq = largestBin * (nyquist / numberOfBins);
  print(loudestFreq);
    return loudestFreq;
}