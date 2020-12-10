var dog, happyDog, database, foodS, foodStock
var d, hd
var feed, addFood
var fedTime, lastFed
var foodObj

function preload()
{
  d = loadImage("Dog.png");
  hd = loadImage("happydog.png");
}

function setup() {
  createCanvas(500, 500);
  dog = createSprite(250, 400, 20, 20);
  dog.addImage(d);
  dog.scale=0.2

  database=firebase.database();
  foodStock=database.ref('Food');
  foodStock.on("value", readStock)

  foodObj = new Food();

  feed=createButton("Feed the dog");
  feed.position(600, 95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(700, 95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(color(179, 241, 242));
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  foodObj.display();

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed: " + lastFed%12 + " PM", 350, 30);
  }

  else if(lastFed===0){
    text("Last Fed: 12 AM", 350, 30);
  }

  else{
    text("Last Fed: " + lastFed +" AM", 350, 30);
  }
 drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(hd);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
}