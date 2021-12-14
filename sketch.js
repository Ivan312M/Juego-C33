const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var suelo;
var cuerda;
var fruta;
var frutaCuerda;

var bg_image;
var bunny_image;
var melon_image;
var bunny;
var button;
var blink;
var eat;
var sad;
var bgSound;
var eatingSound;
var cutSound;
var sadSound;
var air;
var blowout;
var mutebtn;
var cuerda1, cuerda2;
var button1, button2;
var frutaCuerda1, frutaCuerda2;
//var windowWidth, WindowHeigth;
var cannW, cannH;
var isMobile;

function preload(){
  bg_image = loadImage("background.png");
  bunny_image = loadImage("Rabbit-01.png");
  melon_image = loadImage("melon.png");
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png", "eat_5.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  bgSound = loadSound("sound1.mp3");
  eatingSound = loadSound("eating_sound.mp3");
  cutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  air = loadSound("air.wav");
  //happy = loadAnimation()
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
  
}


function setup() 
{
  
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    cannW = displayWidth;
    cannH = displayHeight;
    createCanvas(displayWidth+80, displayHeight);
  }
  else{
    cannW = windowWidth;
    cannH = windowHeight;
    createCanvas(windowWidth, windowHeight);
  }

  engine = Engine.create();
  world = engine.world;
 
  bgSound.play();
  bgSound.setVolume(0.5);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

  /*var frutaOption = {
    density: 0.001
  };*/

  suelo = new Floor (200, cannH, 600, 20);

  fruta = Bodies.circle(300, 300, 20);

  cuerda = new Rope (7, {x: 40, y: 30});

  cuerda1 = new Rope (6, {x: 370, y:40});

  cuerda2 = new Rope (4, {x: 400, y: 250});

  Matter.Composite.add(cuerda.body, fruta);
  frutaCuerda = new Link(cuerda, fruta);
 
  frutaCuerda1 = new Link(cuerda1, fruta);

  frutaCuerda2 = new Link(cuerda2, fruta);

  bunny = createSprite(170, cannH-80, 100, 100);
  bunny.addImage(bunny_image);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking', blink);
  bunny.addAnimation('eating', eat);
  bunny.addAnimation('sad', sad);
  bunny.changeAnimation('blinking');

  button = createImg('cut_button.png');
  button.position(20, 30);
  button.size(50, 50);
  button.mouseClicked(drop);

  button1 = createImg('cut_button.png');
  button1.position(330, 35);
  button1.size(50, 50);
  button1.mouseClicked(drop1);
  
  button2 = createImg('cut_button.png');
  button2.position(360, 200);
  button2.size(50, 50);
  button2.mouseClicked(drop2);

  blowout = createImg('balloon.png');
  blowout.position(10, 230);
  blowout.size(150, 100);
  blowout.mouseClicked(airBlow);

  mutebtn = createImg('mute.png');
  mutebtn.position(450, 20);
  mutebtn.size(50, 50);
  mutebtn.mouseClicked(mute);
  
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_image, 0, 0, displayWidth+80, displayHeight);
  Engine.update(engine);

  suelo.show();
  cuerda.show();
  cuerda1.show();
  cuerda2.show();

  if(fruta!=null){
    image(melon_image, fruta.position.x, fruta.position.y, 60, 60);
  }

  if(collision(fruta,bunny)==true){
    bunny.changeAnimation('eating');
  }

  if(collision(fruta,suelo.body)==true){
    bunny.changeAnimation('sad');
  }

  drawSprites();
}

function drop(){
  cuerda.break();
  frutaCuerda.detach();
  frutaCuerda = null;
}

function drop1(){
  cuerda1.break();
  frutaCuerda1.detach();
  frutaCuerda1 = null;
}

function drop2(){
  cuerda2.break();
  frutaCuerda2.detach();
  frutaCuerda2 = null;
}

function collision(body,sprite){
   if(body!=null){
      var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
      if(d<=60){
        World.remove(engine.world, fruta);
        fruta=null;
        return true;
        
      }
      else{
        return false;
      }
   }
}


function airBlow() {
   Matter.Body.applyForce(fruta, {x: 0, y: 0}, {x: 0.01, y: 0});
   air.play();
}

function mute() {
   if(bgSound.isPlaying()){
      bgSound.stop();
   }
   else{
     bgSound.play();
   }
}
