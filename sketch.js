var dog, happyDog, database, foodS, foodStock;
var dogimg, happyDogimg;
var feedButton, addFood;
var fedTime, lastFed;
var foodObj;

function preload(){
  dogimg = loadImage("images/Dog.png");
  happyDogimg = loadImage("images/HappyDog.png");
}

function setup() {
  var canvas = createCanvas(1200, 600);
  database = firebase.database();
  dog = createSprite(250, 250);
  dog.addImage(dogimg);
  
  foodObj = new Food();

  feedButton = createButton('Feed the Dog');
  feedButton.position(700, 95);
  feedButton.mousePressed(feedDog);

  addFood = createButton('Add Food');
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  foodStock = database.ref('Food');
  foodStock.on("value", readStock, showErr);
  console.log(foodStock);
}

function draw() {  
  background(46, 139, 87);
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  textSize(15);
  if (lastFed>=12) {
    text("Last Feed :"+ lastFed%12 + "PM", 350, 30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM", 350, 30);
  }else{
    text("Last Feed :"+lastFed+"AM", 350, 30);
  }
  foodObj.display()
  drawSprites();
  //add styles here
  stroke("black");
  text("Food :"+foodS, 200, 200);
}

function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    'Food':x
  })
}

function showErr() {
  console.log("Something is wrong with database");
}

function feedDog() {
  dog.image(happyDogimg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}