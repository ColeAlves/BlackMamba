let fft;
var song;
var slider;
var img, originalImg;

function preload(){
  //song = loadSound("Crooked_Straight.mp3", loadedSong);
  song = loadSound("vivaldi_summer.mp3", loadedSong);
  
  originalImg = loadImage("original_starrynight.jpg");
  img = loadImage("original_starrynight.jpg");
  
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  
}

function setup() {
  //Set frame rate to 10 for more stable video
  frameRate(9);
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
  
  loadUI();
  
}

function loadUI(){
  radio = createRadio();
  radio.option('Image Switch', "1");
  radio.option('Greyscale Beat', "2");
  radio.option('Inverted and Circle Beat', "3");
  radio.option('Shifting points', "4");
  radio.option('Cool and Warm Tones', "5");
  radio.option('Base Image', "0");
  radio.style('background-color', color(255,255,255));
  radio.style('width', '400px');
  
  
  
  
}





function draw() {
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
  var mappedFrequency = map(frequencyAtFrame, 0, 100, 0, 10);
  var mappedGreyFrequency = map(frequencyAtFrame, 0, 1000, 0, 255);
  
  
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
  
  switch(radio.value()){
    case "1":
      //pointalizeFilter(mappedFrequency,0,0,0,10);
       switchOnBeatFilter(0,0,0,0,size);
      image(img, 0, 0, width, height);
      break;
    case "2":
      adjustInvertedGreySquareFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0, amplitudeNumber = size, circleDiameter = 25);
      image(img, 0, 0, width, height);
      break;
      case "3":
      colorInvertFilter();
      image(img, 0, 0, width, height);
      fill(mappedGreyFrequency,150);
      ellipse(width/2, height/2, size*10, size*10);
      break;
      case "4":
      shiftingPointalizeFilter(0,0,0,0,size*2,9);
      break;
      case "5":
      adjustCoolWarmFilter(0,0,0,0,size/2);
      image(img, 0, 0, width, height);
      break;
      
    default:
      image(img, 0, 0, width, height);
  }
  //adjustAllRGBAFilter(0,150,200);
  
  //pointalizeFilter(0,0,0,0,10);
  
  //Show edited image
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

function adjustDistanceFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0){

img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    let d = dist(img.width/2, img.height/2,x,y); 
    let factor = map(d, 0,img.width/2,150,0);
    let editedR = img.pixels[index + 0] + factor+ rAdj; //r value
    let editedG = img.pixels[index + 1] + factor+ gAdj; //g value
    let editedB= img.pixels[index + 2] + factor+ bAdj; //b value
    let editedA = img.pixels[index + 3] + factor+ aAdj; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedR;
    img.pixels[index + 1] = editedG;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = editedA;
}
}
  
  img.updatePixels();
}

function switchOnBeatFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0, amplitudeNumber = 1){
  print("Amp: "+amplitudeNumber);
if(!(amplitudeNumber > 5.2)){
img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    let index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] + rAdj; //r value
    let editedG = img.pixels[index + 1] + gAdj; //g value
    let editedB= img.pixels[index + 2] + bAdj; //b value
    let editedA = img.pixels[index + 3] + aAdj; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedG;
    img.pixels[index + 1] = editedR;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = editedA;
}}
}else{
img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    let index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] + rAdj; //r value
    let editedG = img.pixels[index + 1] + gAdj; //g value
    let editedB= img.pixels[index + 2] + bAdj; //b value
    let editedA = img.pixels[index + 3] + aAdj; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedB;
    img.pixels[index + 1] = editedR;
    img.pixels[index + 2] = editedG;
    img.pixels[index + 3] = editedA;
}
}
}
  
  img.updatePixels();
}



//Extra functions after commit Chris
function pointalizeFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0, circleSize = 20){
background(0);
  //print("pointing dots");
img.loadPixels();
for (let x = 0; x < (img.width); x+=circleSize) {
  for (let y = 0; y < (img.height); y+=circleSize) {
    var index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] + rAdj; //r value
    let editedG = img.pixels[index + 1] + gAdj; //g value
    let editedB= img.pixels[index + 2] + bAdj; //b value
    let editedA = img.pixels[index + 3] + aAdj; //a value
    
    fill(editedR,editedG,editedB);
    ellipse(x,y,circleSize, circleSize);
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedR;
    img.pixels[index + 1] = editedG;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = 255;
}
}
  
  img.updatePixels();
}
function shiftingPointalizeFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0, amplitudeNumber = 1, circleSize = 20){
background(0);
  //print("pointing dots");
img.loadPixels();
for (let x = 0; x < (img.width); x+=circleSize) {
  for (let y = 0; y < (img.height); y+=circleSize) {
    var index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0] + rAdj; //r value
    let editedG = img.pixels[index + 1] + gAdj; //g value
    let editedB= img.pixels[index + 2] + bAdj; //b value
    let editedA = img.pixels[index + 3] + aAdj; //a value
    
    fill(editedR,editedG,editedB);
    ellipse(x,y+random(-amplitudeNumber,amplitudeNumber),circleSize, circleSize);
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedR;
    img.pixels[index + 1] = editedG;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = 255;
}
}
  
  img.updatePixels();
}
function adjustGreySquareFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0, amplitudeNumber = 1, circleDiameter = 25) {
 let circleX = img.width/2;
  let circleY =img.height/2;
 circleDiameter *= amplitudeNumber;
  
  img.loadPixels();
  
  
  for (let x = 0; x < (img.width); x++) {
    for (let y = 0; y < (img.height); y++) {
     if(x>circleX-circleDiameter && x<circleX+circleDiameter &&y>circleY-circleDiameter && y<circleY+circleDiameter){
      var index = (x + y * img.width) * 4;
      let grayScale = img.pixels[index + 0] * 0.299 + img.pixels[index + 1] * 0.587 + img.pixels[index + 2] * 0.114;
      
      let editedR = grayScale; //r value
      let editedG = grayScale; //g value
      let editedB = grayScale; //b value
      let editedA = img.pixels[index + 3] + aAdj; //a value

      //putting edited values into their pixel channels
      img.pixels[index + 0] = editedR;
      img.pixels[index + 1] = editedG;
      img.pixels[index + 2] = editedB;
      img.pixels[index + 3] = editedA;
    }
     // fill(grayScale,grayScale,grayScale);
     // ellipse(circleX, circleY, 50,50);
      
    }
  }
 /* let circleXPos = amplitudeNumber * 100;//random(0,img.width);
  let circleYPos = amplitudeNumber * 100;//random(0,img.height);
  ellipse(circleXPos,circleYPos,50,50)*/

  img.updatePixels();
}
function adjustInvertedGreySquareFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0, amplitudeNumber = 1, circleDiameter = 25) {
 let circleX = img.width/2;
  let circleY =img.height/2;
 circleDiameter *= amplitudeNumber;
  
  img.loadPixels();
  
  
  for (let x = 0; x < (img.width); x++) {
    for (let y = 0; y < (img.height); y++) {
     if(!(x>circleX-circleDiameter && x<circleX+circleDiameter &&y>circleY-circleDiameter && y<circleY+circleDiameter)){
      var index = (x + y * img.width) * 4;
      let grayScale = img.pixels[index + 0] * 0.299 + img.pixels[index + 1] * 0.587 + img.pixels[index + 2] * 0.114;
      
      let editedR = grayScale; //r value
      let editedG = grayScale; //g value
      let editedB = grayScale; //b value
      let editedA = img.pixels[index + 3] + aAdj; //a value

      //putting edited values into their pixel channels
      img.pixels[index + 0] = editedR;
      img.pixels[index + 1] = editedG;
      img.pixels[index + 2] = editedB;
      img.pixels[index + 3] = editedA;
    }
     // fill(grayScale,grayScale,grayScale);
     // ellipse(circleX, circleY, 50,50);
      
    }
  }
 /* let circleXPos = amplitudeNumber * 100;//random(0,img.width);
  let circleYPos = amplitudeNumber * 100;//random(0,img.height);
  ellipse(circleXPos,circleYPos,50,50)*/

  img.updatePixels();
}
function adjustCoolWarmFilter(rAdj = 0, gAdj = 0, bAdj = 0, aAdj = 0, amplitudeNumber = 1){

img.loadPixels();
for (let x = 0; x < (img.width); x++) {
  for (let y = 0; y < (img.height); y++) {
    var index = (x+y*img.width)*4;
    let editedR = img.pixels[index + 0]*amplitudeNumber + rAdj; //r value
    let editedG = img.pixels[index + 1] + gAdj; //g value
    let editedB= img.pixels[index + 2] + bAdj; //b value
    let editedA = img.pixels[index + 3]/(amplitudeNumber) + aAdj; //a value
    
    //putting edited values into their pixel channels
    img.pixels[index + 0] = editedR;
    img.pixels[index + 1] = editedG;
    img.pixels[index + 2] = editedB;
    img.pixels[index + 3] = editedA;
}
}
  
  img.updatePixels();
}

