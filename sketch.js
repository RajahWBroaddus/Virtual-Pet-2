var dog, dogPic, happyDog, database, foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
//
function preload() {
    dogPic = loadImage('Dog.png');
    happyDog = loadImage('happydog.png');
}

function setup() {

    createCanvas(1000, 400);
    database = firebase.database();
    foodObj = new Food();
    //
    foodStock = database.ref('Food');
    foodStock.on("value", readStock);
    dog = createSprite(800, 200, 150, 150);
    dog.addImage(dogPic);
    dog.scale = 0.2;
    feed = createButton("Feed Mason");
    feed.position(680, 45);
    feed.mousePressed(feedDog);
    addFood = createButton("Add Food");
    addFood.position(820, 45);
    addFood.mousePressed(addFoods);

}


function draw() {
    background("green")
    foodObj.display();

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function(data) {
        lastFed = data.val();
    });

    fill("white");
    textSize(15);
    if (lastFed >= 12) {
        text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
    } else if (lastFed == 0) {
        text("Last Feed : 12 AM", 350, 30);
    } else {
        text("Last Feed : " + lastFed + " AM", 350, 30);
    }

    drawSprites();
}

//
function readStock(data) {
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
}

//
function addFoods() {
    foodS++;
    database.ref('/').update({
        Food: foodS
    })
}

//
function feedDog() {
    dog.addImage(happyDog);

    foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
    database.ref('/').update({
        Food: foodObj.getFoodStock(),
        FeedTime: hour()
    })
}