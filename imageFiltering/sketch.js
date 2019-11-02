let mic, fft;
var song;
var slider;
var img, originalImg;

function preload(){
  song = loadSound("Crooked_Straight.mp3", loadedSong);
  
  originalImg = loadImage("original_starrynight.jpg");
  img = loadImage("original_starrynight.jpg");
  
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
}

function setup() {
  //Set frame rate to 10 for more stable video
  frameRate(10);
  //Set canvas to a size, similar to its original size to prevent distortion
  createCanvas(710, 400);
  
  //Fourier transform object
  fft = new p5.FFT();
  //Get fourier transform on song
  fft.setInput(song);
  //A 
  slider = createSlider(0,1,0.5, 0.01);
  
  
  
}

function loadedSong(){
  print("hey");
  song.play();
}

function draw() {
  //img = loadImage("original_starrynight.jpg");
  background(200);

  let spectrum = fft.analyze();

  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
  //getLoudestFrequency();
  song.setVolume(slider.value());
  //image(img,0,0);
  
  
  let level = amplitude.getLevel();
  //print("level is "+level);
  let size = map(level, 0, 1, 0, 100);
  ellipse(width/2, height/2, size, size);
  var frequencyAtFrame = getLoudestFrequency();
  
  img.loadPixels();
  originalImg.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    img.pixels[index + 0] = originalImg.pixels[index + 0]; //r value
    img.pixels[index + 1] = originalImg.pixels[index + 1] + frequencyAtFrame;  //g value
    img.pixels[index + 2] = originalImg.pixels[index + 2];  //b value
    img.pixels[index + 3] = originalImg.pixels[index + 3];  //a value
}
}
  
  img.updatePixels();

  
  
img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    img.pixels[index + 0] = img.pixels[index + 0]; //r value
    img.pixels[index + 1] = img.pixels[index + 1]; //+ frequencyAtFrame;  //g value
    img.pixels[index + 2] = img.pixels[index + 2] + size;  //b value
    img.pixels[index + 3] = img.pixels[index + 3];  //a value
}
}
  
  img.updatePixels();
  //saveImage()
  image(img, 0, 0, width, height);
  //image(img, 0, 0, width, height);
  
  //These are graphical representations of the frequency of the amplitude and frequency
  /*fill(50);
  rectMode(CENTER);
  //rectangle showing frequency
  rect(width/2, height/2, frequencyAtFrame,  frequencyAtFrame);
  fill(255);
  //ellipse showing amplitude (mapped to a higher range)
  ellipse(width/2, height/2, size*10, size*10);*/
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

function resetImage(){

}