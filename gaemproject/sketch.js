/*

The Game Project 8 - Make it awesome.
By Shang Ren

*/


/******variables****/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var gameChar_World;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var scrollPos;

var clouds;
var mountains;
var trees_x;
var tree_colors;
var collectables;
var gift;
var gifts;
var emit;
var fire;

var score;
var giftscore;
var lives

var bgmSound;
var gameStart;
var endGame;

var coinSound;
var fallSound;
var overSound;
var giftSound;
var osc1, playing, freq, amp;

/******Sound preload*****/
function preload() 
{
    soundFormats('wav', 'mp3');
    osc1 = new p5.Oscillator('sawtooth');
    bgmSound = loadSound('assets/pipe');
    coinSound = loadSound('assets/coin');
    fallSound = loadSound('assets/fall');
    overSound = loadSound('assets/over');
    giftSound = loadSound('assets/gift');
}
/**** Initialise game****/
function setup() 
{
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    lives = 4;   
    startGame();
}
/******* Draw game ******/
function draw() 
{
    
    // fill the sky blue    
    background(80, 155, 180);
    
    // draw some rain
    fill(0, 255, 200, 90);
    ellipse(random(0, width), random(0, floorPos_y), random(0, 10), random(0, 110));
    
    // game characters movement's sound
    freq = constrain(map(gameChar_y, 0, height, 110, 220), 110, 220);
    amp = constrain(map(gameChar_y, height, 0, 0, 0.03), 0, 0.03);
    if (playing) {
        osc1.freq(freq, 0.1);
        osc1.amp(amp, 0.03);
    }
    
    // draw some green ground 
    noStroke();
    fill(250, 150, 0, random(80,90));
    rect(0, floorPos_y, width, height / 4);
    
    // scene scroll
    push();
    translate(scrollPos, 0);
    
    // Draw gamescene by calling functions
    drawClouds();
    drawMountains();
    // Draw array of trees.
    for (var i = 0; i < trees_x.length; i++) 
    {
        drawTree(trees_x[i]);
    }
    // Check and Draw array of canyons.
    for (var i = 0; i < canyons.length; i++) {
        checkCharCanyon(canyons[i]);
        drawCanyons(canyons[i]);
    }
    // Check and Draw flagpole.
    if (!checkFlagpole.isReached) 
    {
        checkFlagpole(flagpole);
    }
    /******* CALL FUNCTION DRAWFLAGPOLE ********/
    drawFlagpole(flagpole);
    // Check and Draw array of collectable items
    for (var i = 0; i < collectables.length; i++) 
    {
        checkCollectable(collectables[i]);
        drawCollectables(collectables[i]);
    }
    // Check and Draw fire
    for (var i = 0; i < 5; i++) 
    {
        fire[i].updateParticles();
        if (fire[i].checkisTouched(gameChar_World, gameChar_y)) 
        {
            lives -= 1;
        }
    } 
    //Draw array of gifts
    for (var i = 0; i < gifts.length; i++) 
    {
        gifts[i].update();
        gifts[i].draw();
    }
    checkGift();
    pop();
    
    // Draw counting sores
    drawscore();
    drawgiftscore();
    drawLives();

    // Draw the game character
    drawCharacter();

    //////// ********* Game character logic ********* ///////
    if (isLeft) {
        if (gameChar_x > width * 0.2) {
            gameChar_x -= 5;
        } else {
            scrollPos += 5;
        }
    }
    if (isRight) {
        if (gameChar_x < width * 0.8) {
            gameChar_x += 5;
        } else {
            scrollPos -= 5; // negative for moving against the background
        }
    }
    if (gameChar_y < floorPos_y && !endGame) {
        gameChar_y += 3;
        isFalling = true;
    } else {
        isFalling = false;
    }
    if (isPlummeting) {
        isLeft = false;
        isRight = false;
        gameChar_y += 5;
    }
    if (gameChar_y >= height + 80) {
        if (lives >= 1) {
            gameChar_x -= 100;
            gameChar_y = -99;
            isFalling = true;
            isPlummeting = false;
        } 
    }    
    if (isFreeze) {
        isLeft = false;
        isRight = false;
        isFalling = false;
        isPlummeting = false;
    }
    
    //////// *********     Game status       ********* ///////
    // End
    if(lives < 1){
        drawgameover();
    }
    // start
    if (!gameStart) {
        fill(255, 0, 20, 120);
        rect(0, 0, width, height);
        fill(255);
        text("Press Enter to Start Game", width / 2, height / 2);
    }
    // Win
    if (Win) {
        drawWin();
    }
    
    gameChar_World = gameChar_x - scrollPos;   
}
/******* KeyPressed *****/
function keyPressed() 
{
    //Press Enter to restart if end
    if(lives == 0 && keyCode == 13){
        overSound.stop();
        lives = 3;
        startGame();
    }
    //Press Enter to restart if win
    if(Win && keyCode == 13){
        startGame();
    }
     //Press Enter to start 
    if (keyCode == 13) {
        gameStart = true;
        bgmSound.play();
        bgmSound.playMode('restart');
    }
    //Press adw to move
    if (gameStart) {
        if (!isPlummeting && !endGame) {  
            if (key == 'A' || keyCode == 37) {
                isLeft = true;
            }
            if (key == 'D' || keyCode == 39) {
                isRight = true;
            }
            if ((key == "W" || keyCode == 87) && gameChar_y == floorPos_y) {
                gameChar_y -= 150;
            }
        }
    }
    //Keypressed Char movement sound
    if (isFalling || isLeft || isRight) {
        playOscillator(osc1);
    }
}
/****** KeyReleased *****/
function keyReleased() 
{
    if (key == 'A' || keyCode == 37) {
        isLeft = false;
    }
    if (key == 'D' || keyCode == 39) {
        isRight = false;
    }
    //KeyRelease to stop Char movement sound
    osc1.amp(0, 0.5);
    playing = false;
}
/***************** Move Sound *********************/
function playOscillator(osc1) {
    osc1.start();
    playing = true;
}
/***************** DRAW TREE **********************/
function drawTree(posx) {
    var posy = floorPos_y;
    fill(139, 69, 19);
    triangle(posx, posy - 100,
        posx - 10, posy,
        posx + 10, posy);
    for (var i = 0; i < 7; i++) {
        fill(tree_colors[i].r, tree_colors[i].g, tree_colors[i].b);
        triangle(
            posx,
            posy - (122 + (i * 5)),
            posx - (70 - (i * 10)),
            posy - (82 + (i * 10)),
            posx + (70 - (i * 10)),
            posy - (82 + (i * 10))
        );
    }
}
/***************** DRAW CLOUDS ********************/
function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {

        fill(255);
        ellipse(
            clouds[i].x_pos + clouds[i].size / 5,
            clouds[i].y_pos,
            clouds[i].size,
            clouds[i].size);
        ellipse(
            clouds[i].x_pos - clouds[i].size / 5,
            clouds[i].y_pos + 20,
            clouds[i].size,
            clouds[i].size);
        ellipse(
            clouds[i].x_pos + clouds[i].size / 2.5,
            clouds[i].y_pos + 20,
            clouds[i].size,
            clouds[i].size);
        ellipse(
            clouds[i].x_pos - clouds[i].size / 2.5,
            clouds[i].y_pos + 10,
            clouds[i].size,
            clouds[i].size);
        ellipse(
            clouds[i].x_pos - clouds[i].size + 10,
            clouds[i].y_pos + 20,
            clouds[i].size / 1.2,
            clouds[i].size / 1.5);
        ellipse(
            clouds[i].x_pos + clouds[i].size,
            clouds[i].y_pos + 20,
            clouds[i].size / 1.5,
            clouds[i].size / 1.5);
        ellipse(
            clouds[i].x_pos + clouds[i].size / 1.5,
            clouds[i].y_pos + 5,
            clouds[i].size / 1.5,
            clouds[i].size / 1.5);

        if (clouds[i].x_pos == 2000 + clouds[i].size) {
            clouds[i].x_pos = -2000;
        } else {
            clouds[i].x_pos += 0.3;
        }
    }
}
/***************** DRAW MOUNTAINS *****************/
function drawMountains() {
    for (var i = 0; i < mountains.length; i++) {

        fill(0, 122, 122)
        triangle(
            mountains[i].x_pos, floorPos_y - 232,
            mountains[i].x_pos - mountains[i].width * 3, floorPos_y,
            mountains[i].x_pos + mountains[i].width, floorPos_y);

        fill(0, 139, 139);
        triangle(
            mountains[i].x_pos + mountains[i].width, floorPos_y,
            mountains[i].x_pos - mountains[i].width, floorPos_y,
            mountains[i].x_pos, floorPos_y - 232);

        fill(0, 122, 122)
        triangle(
            mountains[i].x_pos, floorPos_y - 232,
            mountains[i].x_pos + mountains[i].width * 3, floorPos_y,
            mountains[i].x_pos + mountains[i].width, floorPos_y);

        fill(0, 139, 139);
        triangle(
            mountains[i].x_pos, floorPos_y,
            mountains[i].x_pos - mountains[i].width * 2, floorPos_y,
            mountains[i].x_pos - mountains[i].width, floorPos_y - 132);

        fill(0, 139, 139);
        triangle(
            mountains[i].x_pos, floorPos_y,
            mountains[i].x_pos + mountains[i].width * 2, floorPos_y,
            mountains[i].x_pos + mountains[i].width, floorPos_y - 132);


    }
}
/***************** DRAW CANYONS *******************/
function drawCanyons(canyon) {
    fill(0);
    rect(canyon.x_pos, floorPos_y, canyon.width, 145);

    for (var j = 0; j < 4; j++) {
        fill(255, 0, 0);

        triangle(
            canyon.x_pos, 450 + j * 30,
            canyon.x_pos + 10, 460 + j * 30,
            canyon.x_pos, 470 + j * 30
        );

        triangle(
            canyon.x_pos + canyon.width, 450 + j * 30,
            canyon.x_pos + canyon.width - 10, 460 + j * 30,
            canyon.x_pos + canyon.width, 470 + j * 30
        );
    }
}
/***************** CHECK CHARCANYON ***************/
function checkCharCanyon(canyon) {
    if (gameChar_y == floorPos_y && canyon.x_pos < gameChar_World && canyon.x_pos + canyon.width > gameChar_World) {
        isPlummeting = true;
        fallSound.play();
        lives -= 1;
    } else if (gameChar_y == floorPos_y + 30 && canyon.x_pos < gameChar_World && canyon.x_pos + canyon.width > gameChar_World && lives < 1) {
      
        bgmSound.stop();
        console.log('dead');
        overSound.play();
    }
}
/***************** DRAW COLLECTABLES **************/
function drawCollectables(collectable) {
    if (collectable.isFound == false) {

        stroke(2);
        fill(255, random(115, 255), 0);

        ellipse(
            collectable.x_pos + random(-1, 1), collectable.y_pos + random(-3, 3),
            collectable.size * 0.5, collectable.size);

        textSize(collectable.size * 0.5);
        textAlign(CENTER, CENTER);
        text("$", collectable.x_pos, collectable.y_pos);

    }
}
/***************** CHECK COLLECTABLE **************/
function checkCollectable(collectable) {
    var d = dist(gameChar_World, gameChar_y - 30, collectable.x_pos, collectable.y_pos);
    if (d < 30 && !collectable.isFound) {
        score += 1;
        coinSound.play();
        collectable.isFound = true;
    }
}
/*************** DRAW COLLECTABLESCORE ************/
function drawscore() {
    fill(0, 255, 255, 90);
    stroke(255, 0, 0, 100);
    strokeWeight(3);
    rect(30, 25, 110, 50);

    stroke(0);
    strokeWeight(1);
    fill(255, 215, 0, 150);
    ellipse(
        50, 50,
        20, 38);

    stroke(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("$", 50, 50);

    stroke(0);
    textSize(30);
    text("=  " + score, 100, 50);
    noFill();
    noStroke();
}

function drawFlagpole(t_flagpole) {
    if (t_flagpole.isReached) {
        fill(255, 0, 0);
        triangle(t_flagpole.x_pos, floorPos_y - 292,
            t_flagpole.x_pos, floorPos_y - 262,
            t_flagpole.x_pos + 60, floorPos_y - 262);
        rect(t_flagpole.x_pos - 2, floorPos_y - 292, 5, 70);
    } else {
        fill(255, 255, 0);
        triangle(t_flagpole.x_pos, floorPos_y - 292, t_flagpole.x_pos, floorPos_y - 262, t_flagpole.x_pos + 60, floorPos_y - 262);
        rect(t_flagpole.x_pos - 2, floorPos_y - 292, 5, 70);
    }
}

function checkFlagpole(t_flagpole) {

    var d = dist(gameChar_World, gameChar_y, t_flagpole.x_pos, floorPos_y - 282);

    if (d < 60 && score >= 10 && lives > 1) {
        t_flagpole.isReached = true;
        Win = true;
    }
    
}

function drawWin() {
    if (Win == true) {
        fill(255, 0, 0, 100);
        rect(0, 0, width, height);

        fill(0, 255, 0, 120);
        stroke(255, 0, 0, 120);

        ellipse(width / 2, height / 2, 300, 100);

        noStroke();
        fill(random(20, 255), random(0, 40), random(40, 100), 180);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("YOU WIN", width / 2, height / 2);

        //happyface
        fill(255, 215, 0);
        ellipse(width / 2, height / 2 - 100, 30, 30);
        fill(0);
        ellipse(width / 2 - 5, height / 2 - 105, 5, 5);
        ellipse(width / 2 + 5, height / 2 - 105, 5, 5);

        noFill();
        stroke(0);
        strokeWeight(1);
        beginShape();
        vertex(width / 2 - 5, height / 2 - 90);
        vertex(width / 2, height / 2 - 85);
        vertex(width / 2 + 5, height / 2 - 90);
        endShape();


    }
}
/***************** DRAW gameover **************/
function drawgameover() {

    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    fill(0, 0, 0, 120);
    stroke(255, 0, 0, 120);

    ellipse(width / 2, height / 2, 300, 100);

    noStroke();
    fill(random(20, 255), random(0, 40), random(40, 100), 180);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("GAMEOVER", width / 2, height / 2);

    fill(255, 255, 0, 180);
    rect(width / 2 - 150, height / 2 + 80, 300, 50);
    textSize(32);
    fill(0, 255, 255, 180);
    textAlign(CENTER, CENTER);
    text("RESTART", width / 2, height / 2 + 105);


    //sadface
    fill(255, 215, 0);
    ellipse(width / 2, height / 2 - 100, 30, 30);
    fill(0);
    ellipse(width / 2 - 5, height / 2 - 105, 5, 5);
    ellipse(width / 2 + 5, height / 2 - 105, 5, 5);

    noFill();
    stroke(0);
    strokeWeight(1);
    beginShape();
    vertex(width / 2 - 5, height / 2 - 90);
    vertex(width / 2, height / 2 - 95);
    vertex(width / 2 + 5, height / 2 - 90);
    endShape();

    //body parts
    fill(255, 182, 193);
    ellipse(random(0, width), random(0, height), 20, 15); //face
    fill(255, 0, 0);
    ellipse(random(0, width), random(0, height), 2, 5); //nose
    ellipse(random(0, width), random(0, height), 10, 5); //hat
    fill("black");
    ellipse(random(0, width), random(0, height), 3, 2);

    //Body
    fill(255, 182, 193);
    ellipse(random(0, width), random(0, height), 40, 45);

    //Arms
    fill(255, 0, 0);
    rect(random(0, width), random(0, height), 5, 20); //arms
    rect(random(0, width), random(0, height), 5, 20);
    fill("black");
    ellipse(random(0, width), random(0, height), 4); //hands
    ellipse(random(0, width), random(0, height), 4);

    //legs
    fill("black");
    ellipse(random(0, width), random(0, height), 15, 8);
    fill(220, 220, 220)
    ellipse(random(0, width), random(0, height), 14, 7);
    fill("black");
    ellipse(random(0, width), random(0, height), 13, 6);
    fill(220, 220, 220)
    ellipse(random(0, width), random(0, height), 12, 5);
    fill(255, 0, 0);
    ellipse(random(0, width), random(0, height), 6);



}
/***************** DRAW CHARACTER *****************/
function drawCharacter() {
    noStroke();
    if (isLeft && isFalling) {
        //jumping-left code
        //Head
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 60 - 8, 15, 15); //face
        fill(255, 0, 0);
        ellipse(gameChar_x - 5, gameChar_y - 60 - 8, 2, 5); //nose
        ellipse(gameChar_x, gameChar_y - 68 - 10, 10, 5); //hat
        fill("black");
        ellipse(gameChar_x, gameChar_y - 69 - 10, 3, 2);

        //Body
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 30 - 8, 40, 45);

        //Arms
        fill(255, 0, 0);
        rect(gameChar_x, gameChar_y - 40, 20, 5); //arms

        fill("black"); //hands
        ellipse(gameChar_x + 10 + 10 + 2, gameChar_y - 40 + 2.5, 4);

        //legs
        fill("black");
        ellipse(gameChar_x, gameChar_y - 10 - 8, 15, 8);
        fill(220, 220, 220)
        ellipse(gameChar_x + 2, gameChar_y - 8 - 5, 14, 7);
        fill("black");
        ellipse(gameChar_x + 4, gameChar_y - 6 - 3, 13, 6);
        fill(220, 220, 220)
        ellipse(gameChar_x + 6, gameChar_y - 4 - 1, 12, 5);
        fill(255, 0, 0);
        ellipse(gameChar_x + 8, gameChar_y, 6);

    } else if (isRight && isFalling) {
        //jumping-right code
        //Head
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 60 - 8, 15, 15); //face
        fill(255, 0, 0);
        ellipse(gameChar_x + 5, gameChar_y - 60 - 8, 2, 5); //nose
        ellipse(gameChar_x, gameChar_y - 68 - 10, 10, 5); //hat
        fill("black");
        ellipse(gameChar_x, gameChar_y - 69 - 10, 3, 2);

        //Body
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 30 - 8, 40, 45);

        //Arms
        fill(255, 0, 0); //arms
        rect(gameChar_x - 10 - 10, gameChar_y - 40, 20, 5);
        fill("black"); //hands
        ellipse(gameChar_x - 10 - 10 - 2, gameChar_y - 40 + 2.5, 4);

        //legs
        fill("black");
        ellipse(gameChar_x, gameChar_y - 10 - 8, 15, 8);
        fill(220, 220, 220)
        ellipse(gameChar_x - 2, gameChar_y - 8 - 5, 14, 7);
        fill("black");
        ellipse(gameChar_x - 4, gameChar_y - 6 - 3, 13, 6);
        fill(220, 220, 220)
        ellipse(gameChar_x - 6, gameChar_y - 4 - 1, 12, 5);
        fill(255, 0, 0);
        ellipse(gameChar_x - 8, gameChar_y, 6);

    } else if (isLeft) {
        //walking left code
        //Head
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 60, 15, 15); //face
        fill(255, 0, 0);
        ellipse(gameChar_x - 5, gameChar_y - 60, 2, 5); //nose
        ellipse(gameChar_x, gameChar_y - 68, 8, 5); //hat
        fill("black");
        ellipse(gameChar_x, gameChar_y - 69, 3, 2);

        //Body
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 30, 40, 45);

        //Arms
        fill(255, 0, 0);
        rect(gameChar_x, gameChar_y - 40, 5, 20); //arms

        fill("black");
        ellipse(gameChar_x + 2.5, gameChar_y - 18, 4); //hands

        //legs
        fill("black");
        ellipse(gameChar_x, gameChar_y - 10, 15, 8);
        fill(220, 220, 220)
        ellipse(gameChar_x + 2, gameChar_y - 8, 14, 7);
        fill("black");
        ellipse(gameChar_x, gameChar_y - 6, 13, 6);
        fill(220, 220, 220)
        ellipse(gameChar_x + 2, gameChar_y - 4, 12, 5);
        fill(255, 0, 0);
        ellipse(gameChar_x + 2, gameChar_y - 2, 6);

    } else if (isRight) {
        //walking right code
        //Head
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 60, 15, 15); //face
        fill(255, 0, 0);
        ellipse(gameChar_x + 5, gameChar_y - 60, 2, 5); //nose
        ellipse(gameChar_x, gameChar_y - 68, 8, 5); //hat
        fill("black");
        ellipse(gameChar_x, gameChar_y - 69, 3, 2);

        //Body
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 30, 40, 45);

        //Arms
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 40, 5, 20);
        fill("black"); //hands
        ellipse(gameChar_x - 10 + 2.5, gameChar_y - 18, 4);

        //legs
        fill("black");
        ellipse(gameChar_x, gameChar_y - 10, 15, 8);
        fill(220, 220, 220)
        ellipse(gameChar_x - 2, gameChar_y - 8, 14, 7);
        fill("black");
        ellipse(gameChar_x, gameChar_y - 6, 13, 6);
        fill(220, 220, 220)
        ellipse(gameChar_x - 2, gameChar_y - 4, 12, 5);
        fill(255, 0, 0);
        ellipse(gameChar_x - 2, gameChar_y - 2, 6);

    } else if (isFalling || isPlummeting) {
        //jumping facing forwards code
        //Head
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 60 - 8, 20, 15); //face
        fill(255, 0, 0);
        ellipse(gameChar_x, gameChar_y - 60 - 8, 2, 5); //nose
        ellipse(gameChar_x, gameChar_y - 68 - 10, 10, 5); //hat
        fill("black");
        ellipse(gameChar_x, gameChar_y - 69 - 10, 3, 2);

        //Body
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 30 - 8, 40, 45);

        //Arms
        fill(255, 0, 0);
        rect(gameChar_x + 5, gameChar_y - 40, 20, 5); //arms
        rect(gameChar_x - 10 - 15, gameChar_y - 40, 20, 5);
        fill("black"); //hands
        ellipse(gameChar_x + 10 + 15 + 2, gameChar_y - 40 + 2.5, 4);
        ellipse(gameChar_x - 10 - 15 - 2, gameChar_y - 40 + 2.5, 4);

        //legs
        fill("black");
        ellipse(gameChar_x, gameChar_y - 10 - 8, 15, 8);
        fill(220, 220, 220)
        ellipse(gameChar_x, gameChar_y - 8 - 5, 14, 7);
        fill("black");
        ellipse(gameChar_x, gameChar_y - 6 - 3, 13, 6);
        fill(220, 220, 220)
        ellipse(gameChar_x, gameChar_y - 4 - 1, 12, 5);
        fill(255, 0, 0);
        ellipse(gameChar_x, gameChar_y, 6);
    } else {
        //standing front facing code
        //Head
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 60, 20, 15); //face
        fill(255, 0, 0);
        ellipse(gameChar_x, gameChar_y - 60, 2, 5); //nose
        ellipse(gameChar_x, gameChar_y - 68, 10, 5); //hat
        fill("black");
        ellipse(gameChar_x, gameChar_y - 69, 3, 2);

        //Body
        fill(255, 182, 193);
        ellipse(gameChar_x, gameChar_y - 30, 40, 45);

        //Arms
        fill(255, 0, 0);
        rect(gameChar_x + 5, gameChar_y - 40, 5, 20); //arms
        rect(gameChar_x - 10, gameChar_y - 40, 5, 20);
        fill("black");
        ellipse(gameChar_x + 5 + 2.5, gameChar_y - 18, 4); //hands
        ellipse(gameChar_x - 10 + 2.5, gameChar_y - 18, 4);

        //legs
        fill("black");
        ellipse(gameChar_x, gameChar_y - 10, 15, 8);
        fill(220, 220, 220)
        ellipse(gameChar_x, gameChar_y - 8, 14, 7);
        fill("black");
        ellipse(gameChar_x, gameChar_y - 6, 13, 6);
        fill(220, 220, 220)
        ellipse(gameChar_x, gameChar_y - 4, 12, 5);
        fill(255, 0, 0);
        ellipse(gameChar_x, gameChar_y - 2, 6);
    }
}

function drawGifts(x, y) {
    var g = gift;
    g = {

        pos: undefined,
        dir: undefined,

        tailFlick: 4,
        tailIncr: -1,

        isOpened: false,


        setup: function (x, y) {
            this.pos = createVector(x, y);
            this.dir = createVector(1, -1);
            this.dir.normalize();
        },

        draw: function () {
            push();
            translate(this.pos.x, this.pos.y);

            if (!this.isOpened) {
                fill(100, 100);
                stroke(150);
                rect(0, 0, 25, 25);

                fill(255, 102, 153, 51);
                text('?', 1.5, 0, 27, 25);
            } else {

                rotate(PI * -0.5);

                fill(255, 192, 203, 90);
                stroke(255, 192, 203);
                ellipse(0, 0, 28, 20);

                strokeWeight(2);
                noFill();
                beginShape();

                curveVertex(-14, 0);
                curveVertex(-14, 0);
                curveVertex(-20, this.tailFlick);
                curveVertex(-30, this.tailFlick * 1.5);
                curveVertex(-46, 0);
                curveVertex(-46, 0);

                endShape();
            }
            pop();
        },
        update: function () {
            if (!this.isOpened) {
                this.pos.x += random(-0.5, 0.5);
                this.pos.y += random(-0.5, 0.5);
            } else {
                this.tailFlick += this.tailIncr;

                if (abs(this.tailFlick) > 5) {
                    this.tailIncr *= -1;
                }
                this.pos.add(this.dir);
            }
        },

        testClick: function (mouse) {
            if (this.pos.dist(mouse) < 35) {
                this.isOpened = true;
                giftscore += 1;
                giftSound.play();
                lives += 1;
            }
        }
    };

    g.setup(x, y);
    return g;
}

function checkGift() {

    var v = createVector(gameChar_World, gameChar_y - 40);

    for (var i = 0; i < gifts.length; i++) {
        if (!gifts[i].isOpened) {
            gifts[i].testClick(v);

        }
    }


}

function drawgiftscore() {

    fill(0, 255, 255, 90);
    stroke(255, 0, 0, 100);
    strokeWeight(3);
    rect(30, 75, 110, 50);


    stroke(0);
    strokeWeight(1);
    fill(255, 215, 0, 150);
    ellipse(
        50, 50,
        20, 38);


    stroke(0);
    textSize(30);
    text("=  " + giftscore, 100, 100);
    noFill();
    noStroke();

    fill(255, 192, 203, 150);
    stroke(255, 192, 203);
    ellipse(50, 100, 20, 28);

    noFill();
    beginShape();

    curveVertex(50, 112);
    curveVertex(50, 112);
    curveVertex(40, 130);
    curveVertex(50, 140);
    curveVertex(40, 150);
    curveVertex(40, 150);

    endShape();
}

function drawLives() {


    noStroke();
    fill(0, 255, 255, 90);
    stroke(255, 0, 0, 100);
    strokeWeight(3);
    rect(30, 125, 110, 50);

    noFill();
    noStroke();
    fill(255, 192, 203, 150);
    stroke(255);
    textSize(28);
    text("=  " + lives, 100, 150);



    var x = 55;
    var y = 170;

    noStroke();
    fill(255, 182, 193);
    ellipse(x, y, 20 / 2, 15 / 2); //face
    fill(255, 0, 0);
    ellipse(x, y, 2 / 2, 5 / 2); //nose
    //    ellipse(x, y+8, 10/2, 5/2); //hat
    //    fill("black");
    //    ellipse(x, y+7, 3/2, 2/2);

    //Body
    fill(255, 182, 193);
    ellipse(x, y - 20, 40 / 2, 45 / 2);

    //Arms
    fill(255, 0, 0);
    rect(x + 5, y - 15, 5 / 2, 20 / 2); //arms
    rect(x - 10, y - 15, 5 / 2, 20 / 2);
    fill("black");
    ellipse(x + 5 + 2.5, y - 15, 4 / 2); //hands
    ellipse(x - 10 + 2.5, y - 15, 4 / 2);

    //legs
    fill("black");
    ellipse(x, y - 10, 15 / 2, 8 / 2);
    fill(220, 220, 220)
    ellipse(x, y - 8, 14 / 2, 7 / 2);
    fill("black");
    ellipse(x, y - 6, 13 / 2, 6 / 2);
    fill(220, 220, 220)
    ellipse(x, y - 4, 12 / 2, 5 / 2);
    fill(255, 0, 0);
    ellipse(x, y - 2, 6 / 2);



}

function startGame() {

    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    score = 0;
    giftscore = 0;
    // Boolean variables of game status
    gameStart = false;
    endGame = false;
    // Initialise flagpole
    flagpole = {
        x_pos: 430,
        isReached: false
    }

    Win = false;
    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    isFreeze = false;

    // Variable to control the background scrolling.
    scrollPos = 0;
    gameChar_World = gameChar_x - scrollPos;
    // Initialise arrays of scenery objects.
    /************* ARRAY OF GIFTS (lives) ************/
    gifts = [];
    for (var i = 0; i < 3; i++) {
        gifts.push(drawGifts(random(-3000, 3000), floorPos_y - 60));
    }
    /************ ARRAY OF TREE POSITION X ***********/
    trees_x = [156, 329, 513, 994, 700, 800];
    /************ ADD EXTRA TREES ********************/
    for (var i = 0; i < 20; i++) {
        treesx = round(random(-3000, 3000));
        if ((treesx > -3000 && treesx < 0) || (treesx > 1024 && treesx < 4000)) {
            trees_x.push(treesx);
        }
    }
    /************ ARRAY OF TREE LEAF COLORS **********/
    tree_colors = [
        {
            r: 0,
            g: 140,
            b: 212
        },
        {
            r: 10,
            g: 160,
            b: 212
        },
        {
            r: 30,
            g: 180,
            b: 212
        },
        {
            r: 50,
            g: 200,
            b: 212
        },
        {
            r: 50,
            g: 240,
            b: 212
        },
        {
            r: 80,
            g: 255,
            b: 212
        },
        {
            r: 127,
            g: 255,
            b: 212
        }
    ];
    /************ ARRAY OF CLOUDS ********************/
    clouds = [
        {
            x_pos: 150,
            y_pos: 80,
            size: 60
        },
        {
            x_pos: 70,
            y_pos: 80,
            size: 70
        },
        {
            x_pos: 450,
            y_pos: 140,
            size: 40
        },
        {
            x_pos: 850,
            y_pos: 150,
            size: 35
        },
        {
            x_pos: 410,
            y_pos: 140,
            size: 55
        }
    ];
    /************ ADD EXTRA CLOUDS *******************/
    for (var i = 0; i < 20; i++) {
        clouds_x = round(random(-3000, 3000));
        if ((clouds_x > -3000 && clouds_x < 0) || (clouds_x > 1024 && clouds_x < 4000)) {
            clouds.push({
                x_pos: clouds_x,
                y_pos: random(10, 100),
                size: random(30, 70)
            });
        }
    }
    /************ ARRAY OF MOUNTAINS *****************/
    mountains = [
        {
            x_pos: 600,
            width: 50
        },
        {
            x_pos: 230,
            width: 50
        },
        {
            x_pos: 430,
            width: 80
        }

    ];
    /************ ADD EXTRA MOUNTAINS ****************/
    for (var i = 0; i < 10; i++) {
        mountain_x = round(random(-3000, 3000));
        if ((mountain_x > -3000 && mountain_x < 0) || (mountain_x > 1300 && mountain_x < 4000)) {
            mountains.push({
                x_pos: mountain_x,
                width: round(random(50, 80))
            });
        }
    }
    /************ ARRAY OF CANYONS *******************/
    canyons = [
        {
            x_pos: 200,
            width: 120
        },
        {
            x_pos: 600,
            width: 80
        }
    ]
    /************ ADD EXTRA CANYONS ******************/
    for (var i = 0; i < 10; i++) {
        canyon_x = round(random(-3000, 3000));
        for (var j = 0; j < canyons.length; j++) {
            if ((canyon_x > canyons[j].x_pos - 100) && (canyon_x < canyons[j].x_pos + canyons[j].width + 100)) {
                canyon_x += 300
            }
        }
        if ((canyon_x > -3000 && canyon_x < 0) || (canyon_x > 1300 && canyon_x < 4000)) {
            canyons.push({
                x_pos: canyon_x,
                width: random(50, 100)
            });
        }
    }
    /************ ARRAY OF RANDOME FIRE **************/
    fire = [];
    for (var i = 0; i < 10; i++) {
        var a = new Emitter(random(-3000, 3000), floorPos_y, 0, -2, 4, color(255, 0, 0), color(0, 255, 255), false);
        fire.push(a);
    }
    for (var i = 0; i < 10; i++) {
        fire[i].startEmitter(200, 100);
    }
    /************ ARRAY OF COLLECTABLES **************/
    collectables = [
        {
            x_pos: 400,
            y_pos: 360,
            size: 30,
            isFound: false
        },
        {
            x_pos: 700,
            y_pos: 360,
            size: 30,
            isFound: false
        }
    ]
    /************ ADD EXTRA COLLECTABLES *************/
    for (var i = 0; i < 40; i++) {
        collectable_x = round(random(-3000, 3000));
        if ((collectable_x > -3000 && collectable_x < 0) || (collectable_x > 1300 && collectable_x < 4000)) {

            collectables.push({
                x_pos: collectable_x,
                y_pos: 360,
                size: 30,
                isFound: false
            });
        }
    }

}


