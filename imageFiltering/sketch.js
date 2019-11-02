let mic, fft;
var song;
var slider;
var img, originalImg;
var milliseconds;
var millisecondsWhenStarted;

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
  //use slider. Note we can also add buttons
  slider = createSlider(0,1,0.5, 0.01);
  
  
  
}

function loadedSong(){
  //this function is called when the song is loaded
  song.play();
  millisecondsWhenStarted = millis();
}

function draw() {
  if(song.isLoaded()){
    //Get time in milliseconds after song has been loaded
  milliseconds = millis() - millisecondsWhenStarted;
    print("Milliseconds: "+milliseconds);
  }
  //set background to remove colors on previous
 background(200);
  //Reset edited image back to original so edits do not compound
  resetImage();

  //Allow for frequency analysis
  let spectrum = fft.analyze();

  //Shape for fourier transform (not used in program, but looks cool)
  /*beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
  */
  //Uses the created slider to adjust volume of song
  song.setVolume(slider.value());
  
  //Getting amplitude
  let level = amplitude.getLevel();
  //level is between 0 and 1 so (to better see the changes) we map it to a higher range of 0 to 100
  var size = map(level, 0, 1, 0, 100);
  //Getting frequency
  var frequencyAtFrame = getLoudestFrequency();
  
  
  /* put whatever filters and logic for when the filters play into this area*/
  
  
  /* Example of using amplitude in logic for filters
  if(size > 2){
  blueGreenAdjustFilter();
  }else{
  redAdjustFilter();
  }*/
  
  /* Example using amplitude as parameter
  amplitudeApplyFilter(size*10);
  */
  
  /* Example using parameters to adjust each rgb, although it has default adjust values of zero; parameters are optional*/
  adjustAllRGBAFilter(0,150,200);
  
  //Show edited image
  image(img, 0, 0, width, height);
  
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
  //A function that (should according to the internet) get the frequency of the sound at that point. 
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
    return loudestFreq;
}

function resetImage(){
img.loadPixels();
  originalImg.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    img.pixels[index + 0] = originalImg.pixels[index + 0]; //r value
    img.pixels[index + 1] = originalImg.pixels[index + 1];  //g value
    img.pixels[index + 2] = originalImg.pixels[index + 2];  //b value
    img.pixels[index + 3] = originalImg.pixels[index + 3];  //a value
}
}
  img.updatePixels();

}

function noEditFiltering(){

img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    img.pixels[index + 0] = img.pixels[index + 0]; //r value
    img.pixels[index + 1] = img.pixels[index + 1]; //g value
    img.pixels[index + 2] = img.pixels[index + 2]; //b value
    img.pixels[index + 3] = img.pixels[index + 3]; //a value
}
}
  
  img.updatePixels();
}
function redAdjustFilter(){

img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] + 50; //r value
    let editedG = img.pixels[index + 1]; //g value
    let editedB= img.pixels[index + 2]; //b value
    let editedA = img.pixels[index + 3]; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedR;
    img.pixels[index + 1] = editedG;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = editedA;
}
}
  
  img.updatePixels();
}
function blueGreenAdjustFilter(){

img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] ; //r value
    let editedG = img.pixels[index + 1] + 100; //g value
    let editedB= img.pixels[index + 2] - 50; //b value
    let editedA = img.pixels[index + 3]; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedR;
    img.pixels[index + 1] = editedG;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = editedA;
}
}
  
  img.updatePixels();
}
function colorInvertFilter(){

img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] ; //r value
    let editedG = img.pixels[index + 1] + 100; //g value
    let editedB= img.pixels[index + 2] - 50; //b value
    let editedA = img.pixels[index + 3]; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedG;
    img.pixels[index + 1] = editedR;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = editedA;
}
}
  
  img.updatePixels();
}
function amplitudeApplyFilter(amplitudeNumber){

img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] ; //r value
    let editedG = img.pixels[index + 1] + amplitudeNumber; //g value
    let editedB= img.pixels[index + 2] - 50; //b value
    let editedA = img.pixels[index + 3]; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedG;
    img.pixels[index + 1] = editedR;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = editedA;
}
}
  
  img.updatePixels();
}

function adjustAllRGBAFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0){

img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] + rAdj; //r value
    let editedG = img.pixels[index + 1] + gAdj; //g value
    let editedB= img.pixels[index + 2] + bAdj; //b value
    let editedA = img.pixels[index + 3] + aAdj; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedR;
    img.pixels[index + 1] = editedG;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = editedA;
}
}
  
  img.updatePixels();
}