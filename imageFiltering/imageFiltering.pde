PImage img;
int millisecondsPassed;

void setup() {
  img = loadImage("starrynight.jpg");
  size(1280, 800);
}

void draw() {
  millisecondsPassed = millis();
  //image(img, 0, 0);
  color pink = color(255, 102, 204);
  loadPixels();
for (int x = 0; x < (width); x++) {
  for (int y = 0; y < (height); y++) {
    int loc = x+y*width;
    //pixels[loc] = img.pixels[loc];
    float r = red(img.pixels[loc]);
    float g =green(img.pixels[loc]);
    float b = blue(img.pixels[loc]);
    float brightness = brightness(img.pixels[loc]);
    
    /*editing by distance to point
    float d = dist(mouseX, mouseY, x, y);
    float factor = map(d, 0,200,150,0);
    pixels[loc] = color(r+factor,g+factor,b+factor);
    */
    
    /* editing by brightness
    if(brightness>100){
    pixels[loc] = color(255);
    }else{
    pixels[loc] = color(0);
    }
    */
    
    /*editing by location
    if(y>height/2){
    pixels[loc] = color(b);
    }else{
    pixels[loc] = color(r,g,b);
    }
    */
    
    pixels[loc] = color(r,g,b);
}
}
updatePixels();
}
