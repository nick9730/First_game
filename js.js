




    var canv = document.getElementById('canv');
var contx = canv.getContext('2d');
var playAgain = document.getElementById('play_again');
var plaisio = document.getElementById('plaisio');
var win  = document.getElementById('win');
var epomeno = document.getElementById('next_level');
var play = document.getElementById('play_button');
var plaisioPlay = document.getElementById(`plaisio_play`);
var plaisioGame_over = document.getElementById('game_over_plaisio');







let images = {
    lives: new Image(),
    ball: new Image(),
    pandle:new Image(),
    brick:new Image(),
    background:new Image(),
    level_up:new Image(),
    score_star:new Image()
  }
  images.lives.src = 'pngwing.com.png';
  images.ball.src = 'ball.png';
  images.brick.src = 'brick.png';
  images.pandle.src = 'paddle.png';
  images.background.src = 'background.png';
  images.score_star.src = 'katalogos.png';
  images.level_up.src='level.png'
let audio = {
    lives_audio : new Audio(),
    ball_audio : new Audio(),
    win_audio : new Audio(),
    break_audio:new Audio(),
    game_audio:new Audio(),
    game_over_audio:new Audio(),
    level_audio: new Audio()

}

audio.ball_audio.src ='mixkit-game-ball-tap-2073.wav';
audio.win_audio.src = 'mixkit-game-level-completed-2059.wav';
audio.break_audio.src = 'zapsplat_impacts_wood_split_crack_break_splinter_003_70993.mp3';
audio.game_audio.src = 'cheeky_monkey_fun_app_playful_cheeky.mp3';
audio.lives_audio.src='zapsplat_multimedia_game_sound_percussive_negative_lose_fail_001_63677.mp3';
audio.game_over_audio.src= 'zapsplat_human_male_voice_says_game_over_001_15726.mp3';
audio.level_audio.src='level_up.mp3';



var chances_game =4;
var play_fores = 1;
var pause = false;
var ball_radius = 10;
var pandleHeight = 10;
var pandleWidth  = 75;
var panddlex = (canv.width- pandleWidth)/2;
var panddley = (canv.height-pandleHeight);
var rightPressed = false;
var leftPressed = false;
var spacebarpressed =false;
var score = 0 ;

let powerUp_arrays = [];
let bricks=[];
let zwes_array = [];
let elegxos=1;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

const powerUp_elements = {
    x:Math.random() *800,
    y:Math.random() * 50,
    width:100,
    height:20,
    dy:-3,
    dx:3,
    status:1
    
  
}
const zwes={
    width:30,
    height:25,
    zwes_rows : 4,
    color:'black',
    top_margin : 40,
    left_offset : 40
}
const ball=  {
    x : canv.width/2 - ball_radius,
    y: canv.height -20,
    radius: ball_radius,
   
}

const levels_brick = [
    {
        row:50,
        column:50,
        difficulty:1
    }
    
    
    ,{
    dx_brick:3,
    dy_brick:-4,
    level:1,
    row:5,
    column:6,
    width :110,
    height :20,
    distance_left:20,
    distance_right:25,
    distance_top:15,
    margin_top :50,
 difficulty:-1,
    speed_pandle : 7,
    speed:5,
   


},
{
    dx_brick:3,
    dy_brick:3,
    level:2,
    row:7,
    column:9,
    width :80,
    height :10,
    distance_left:20,
    distance_right:10,
    distance_top:15,
    difficulty:0,
    difficulty_level_2:1,
    margin_top :30,
    speed_pandle :6.5,
    speed:5,
    
},{
    dx_brick:3,
    dy_brick:3,
    level:3,
    row:10,
    column:20,
    width :50,
    height :3,
    distance_left:20,
    distance_right:20,
    distance_top:2,
    difficulty:1,
    margin_top :30,
    speed_pandle :4,
    speed:11
    
},
{
    dx_brick:3,
    dy_brick:3,
    level:4,
    row:5,
    column:20,
    width :50,
    height :3,
    distance_left:20,
    distance_right:20,
    distance_top:2,
    difficulty:1,
    margin_top :30,
    speed_pandle :75,
    speed:8
    
}
];
var dx = levels_brick[elegxos].dx_brick;
var dy = levels_brick[elegxos].dy_brick;

for (let c=0; c<levels_brick[0].column;c++){
    bricks[c]=[]; 
  for (let r=0; r<levels_brick[0].row;r++){
      bricks[c][r] ={ x:0 , y:0 , status :1 }
  
}
};

for (let c=0; c<levels_brick[0].column;c++){
    powerUp_arrays[c]={x:0,y:0,status:1}
};


for (let c=0; c<levels_brick[elegxos].column;c++){
    for (let r=0; r<levels_brick[elegxos].row;r++){
    bricks[c][levels_brick[elegxos].difficulty]={status:3}; }
};

function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key==0|| e.key==32){
        spacebarpressed=true;
}
}
    
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key ==0|| e.key==32){
        spacebarpressed=false;
}
}



function drawBall() {
    contx.beginPath();
    contx.arc(ball.x, ball.y,ball.radius,0,Math.PI*2);
    contx.fillStyle = "black";
    contx.fill();
    contx.closePath();
}

function move_ball(){
    ball.x+=dx;
    ball.y+=dy;
    var delta;
    if (ball.x - ball.radius <= 0){
        delta=ball.x-ball.radius;
        ball.x = ball.radius-delta;
        dx = -dx;
      }
      else if (ball.x + ball.radius >= canv.width){
        delta = ball.x+ ball.radius -canv.width;
        ball.x = canv.width - ball.radius;
        dx = -dx;
      }
    
      // vertical bounce
      if (ball.y - ball.radius <= 0){
        ball.y = ball.radius;
        dy=-dy;
      }
      else if (ball.y + ball.radius >= canv.height){
        ball.y = canv - ball.radius;
        dy = -dy;
      }
}
   
function drawPandle(){
 contx.beginPath();
 contx.rect(panddlex,panddley,pandleWidth,pandleHeight);
 contx.fillStyle = "black";
 contx.fill();
 contx.closePath();
};

function move_pandle(){
    if(rightPressed && panddlex < canv.width-pandleWidth) {
        panddlex += levels_brick[elegxos].speed_pandle;
    }
    else if(leftPressed && panddlex > 0) {
        panddlex -= levels_brick[elegxos].speed_pandle;
    }
    
};


    
function deije_levels(){
  
    contx.beginPath();
    contx.font='30px Arial'
    contx.fillStyle = 'black';
    contx.drawImage(images.level_up,canv.width/2 -80,2,40,40)
    contx.fillText( levels_brick[elegxos].level,canv.width/2 -40 ,35)
    contx.fill();
    contx.closePath(); 
};
function deije_lives(){
    for(let i=0;i<zwes.zwes_rows;i++){
        zwes_array[i] = {
            x:60 , y:9 ,  status:1}
    }
        for(let i=0;i<zwes.zwes_rows;i++){
            if(zwes_array[i].status==1){
                contx.beginPath();
                contx.drawImage(images.lives,zwes_array[i].x+(zwes.left_offset*i -30),zwes_array[i].y,zwes.width,zwes.height)
                contx.fillStyle=zwes.color;
                contx.fill();
                contx.closePath();
            }
        }
};


function power_up(){
    contx.rect(powerUp_elements.x,powerUp_elements.y,powerUp_elements.height,powerUp_elements.width)
    contx.fillStyle='red';
    contx.fill();
}
function power_up_zwes(){
    if(levels_brick[elegxos].level == 1 ){
        chances_game = 0;
    }
    var tuxaios = 0;
    if(levels_brick[elegxos].level ==2 ){
       if(tuxaios<chances_game){
        tuxaios++
            console.log('tuxioas',tuxaios)
        if(tuxaios > 0  || tuxaios   <=2){
    for (let c=0; c<levels_brick[elegxos].column;c++){
        for (let r=0; r<levels_brick[elegxos].row;r++){
         if(ball.y>bricks[c][r].y && ball.y<bricks[c][r].y + levels_brick[elegxos].height ||  bricks[c][r].status==0){
            power_up();
            powerUp_elements.y -= -1;
            }
        
       else if(powerUp_elements.y+ powerUp_elements.dy>canv.height -powerUp_elements.height &&powerUp_elements.x>panddlex && powerUp_elements.x<panddlex+pandleWidth && panddley < panddley +pandleHeight && powerUp_elements.y < panddley) {        
          zwes.zwes_rows++;
          powerUp_elements.status=0;
          if(powerUp_elements.status==0){
            powerUp_elements.y =canv.height +200;

          }
          
     }}}}
     }
    }
}



function pause_1(){
    if (pause){
        pause = false;
       draw();
      }
      else{
        pause = true;
      }
}



function randomBrickColor() {
   
        var colors = ['#6c086d', '#1d61ae', '#319a2d','#c91010','#f2d042'];
        if(elegxos==1){
        var randomColor = colors[Math.floor(Math.random() * colors.length)];
        levels_brick[elegxos].color = randomColor;
        }   
};
randomBrickColor();
    
function brick_dwse(){
    
 
    for(let c=0; c<levels_brick[elegxos].column;c++){
        for(let r=0; r<levels_brick[elegxos].row;r++){
            
            if(bricks[c][r].status>0){
              
                  axe_x = c*(levels_brick[elegxos].width + levels_brick[elegxos].distance_left+levels_brick[elegxos].distance_right) + levels_brick[elegxos].distance_left;
                  axe_y =  r*(levels_brick[elegxos].height+levels_brick[elegxos].distance_top)+levels_brick[elegxos].margin_top +levels_brick[elegxos].distance_top;
                  bricks[c][r].x = axe_x;
                  bricks[c][r].y =axe_y;
                  contx.beginPath();
                  contx.rect(axe_x,axe_y,levels_brick[elegxos].width,levels_brick[elegxos].height);  
                 
                  if(bricks[c][r].status==2){
                    contx.fillStyle = 'red';
                  }
                  else if(bricks[c][r].status==1){
                    contx.fillStyle = 'black';
                  } 
                  else if(bricks[c][levels_brick[elegxos].difficulty].status==3){
                    contx.fillStyle='purple';
                  }
                  
                 
                 
                  contx.fill(); 
                  contx.closePath();
                  
          
            }
        }
    }
   
};
                

function epistrofes(){
    for (let c=0; c<levels_brick[elegxos].column;c++){
      for (let r=0; r<levels_brick[elegxos].row;r++){
        brick_col_row = bricks[c][r];
       brick_zwgrafismena= bricks[c][levels_brick[elegxos].difficulty];
          if(brick_col_row.status >0 ){
            if(ball.x>brick_col_row.x && ball.x<brick_col_row.x + levels_brick[elegxos].width&&
                ball.y>brick_col_row.y && ball.y<brick_col_row.y + levels_brick[elegxos].height){
                    brick_col_row.status=brick_col_row.status -1; 
                    dy=-dy;
                    audio.break_audio.currentTime=0;
                    audio.break_audio.play();
                   
                       if(brick_col_row.status==0 ){
                                score = score + 10 ; 
                                console.log(score)
                       }
                       else if(brick_col_row.status==2){
                                score = score +10
                       }
                       else if(brick_col_row.status==1){
                        score = score +30
               }
                       else if(brick_col_row.status==3){
                        score = score +40
       }
       var win_check = true;
       for (let c=0; c<levels_brick[elegxos].column;c++){
        
        for (let r=0; r<levels_brick[elegxos].row;r++){
        if(bricks[c][r].status != 0){
             win_check=false;
             audio.game_audio.play();
        }}};
        if(win_check==true){
            
          console.log('nikos')
          win.style.opacity='1';
          win.style.visibility='visible';
             dx= 0;
             dy=0;
             audio.level_audio.play();
             audio.game_audio.pause();
        }
       
       
}}}
};
}

function win_checked_game(){
    
    
    ;}



function score_ever(){
    contx.font='36px Arial';
    contx.fillStyle='black';
   contx.drawImage(images.score_star,canv.width/2 +100,4,40,40);
   contx.fillText(score,canv.width/2 +140,40);
 
    var score_epomeno = parseFloat(levels_brick[elegxos].row*levels_brick[elegxos].column *10);
    var score_prohgouemno_1 = parseFloat(levels_brick[elegxos-1].row* levels_brick[elegxos-1].column *10);
    if(parseFloat(levels_brick[elegxos].level) <=1 ){
               let score_ligo  = score_epomeno;
  ///mhn to ksexaseis to ilia
     if(score_ligo ==score ){
       
        win.style.opacity='1';
        win.style.visibility='visible';
         }
      }
      else if(parseFloat(levels_brick[elegxos].level) >1 ){
        let score_ligo = score_epomeno +score_prohgouemno_1;
        if(score_ligo == score+1000){
            console.log('to score einai panw apo 1',score_ligo)
            
         }
        }
};
function duskolia(){
    for (let c=0; c<levels_brick[elegxos].column;c++){
      for (let r=0; r<levels_brick[elegxos].row;r++){
           if(bricks[c][levels_brick[elegxos].difficulty.status ]>0 ){
               if(ball.x>brick_col_row.x && ball.x<brick_col_row.x + levels_brick[elegxos].width&&
                   ball.y>brick_col_row.y && ball.y<brick_col_row.y + levels_brick[elegxos].height){
                   bricks[c][levels_brick[elegxos].difficulty.status] = bricks[c][levels_brick[elegxos].difficulty.status]-1 ;
                   console.log( bricks[c][levels_brick[elegxos].difficulty.status])
                   dy=-dy;
                   audio.break_audio.currentTime=0;
                   audio.break_audio.play();
                   }}}
          }
};
  

/// koumi gia next level
function epistrofes_pandle_ball(){
    if(ball.x == panddlex +40 || ball.y == canv.height - pandleHeight -pandleHeight){
        if(spacebarpressed){
            dx =levels_brick[elegxos].speed * (Math.random() * 2 - 1);
            dy= levels_brick[elegxos].dy_brick;
}
        if(rightPressed && panddlex < canv.width-pandleWidth) {
            panddlex += levels_brick[elegxos].speed_pandle;
            ball.x +=levels_brick[elegxos].speed_pandle*2;}
            else if(leftPressed && panddlex > 0){
                panddlex -= levels_brick[elegxos].speed_pandle;
                ball.x -=levels_brick[elegxos].speed_pandle*2;}
    }
};

function epistrofes_canvas_panle_ball_zwes(){ 
    if (ball.x+dx>canv.width-ball_radius || ball.x +dx <ball_radius ){
    dx =-dx;
    audio.ball_audio.play(); }


if (ball.y+dy <ball_radius ){
dy=-dy;
audio.ball_audio.play();
}
else if (ball.y+dy>canv.height-ball_radius){
if(ball.x>panddlex && ball.x<panddlex+pandleWidth && panddley < panddley +pandleHeight && ball.y < panddley){
 let xtyphma = ball.x -(panddlex +pandleWidth/2);
 xtyphma = xtyphma/(pandleWidth/2);
 let angle = xtyphma * Math.PI/4;
  dx = levels_brick[elegxos].speed * Math.sin(angle);
  dy = -levels_brick[elegxos].speed * Math.cos(angle);
  audio.ball_audio.currentTime = 0 ;
    audio.ball_audio.play();
}
else{
    audio.lives_audio.play();
zwes.zwes_rows--;
console.log(zwes.zwes_rows);
if(!zwes.zwes_rows){ 
 audio.game_over_audio.play();
 dx=0;
 dy=0;
 plaisioGame_over.style.opacity = '1';
 plaisioGame_over.style.visibility = 'visible';
 
 playAgain.addEventListener('click',()=>{
 document.location.reload(); 
 plaisioGame_over.style.opacity = '0';
 plaisioGame_over.style.visibility = 'hidden';


  
})}
}

}



if(ball.y+dy > canv.height-ball_radius  ){ 
 ball.x=panddlex +40 ;
 ball.y=canv.height - pandleHeight -pandleHeight;
 dy=0;
 dx=0;

}



}

play.addEventListener('click',()=>{
    play_fores++
    if(play_fores==2){
        plaisioPlay.style.opacity = '0';
        plaisioPlay.style.visibility='hidden';
    draw();
}
}
)
   

epomeno.addEventListener('click',()=>{
    elegxos++;
for (let c=0; c<levels_brick[elegxos].column;c++){
  for (let r=0; r<levels_brick[elegxos].row;r++){
       brick_col_row = bricks[c][r];
      brick_col_row.status = 1 }}   
       win.style.opacity='0';
       win.style.visibility='hidden';   
       ball.x=panddlex +40 ;
       ball.y=canv.height - pandleHeight -pandleHeight;
      var difficulty = levels_brick[elegxos].difficulty++;
       console.log(elegxos);
       if(levels_brick[elegxos].level==2){
       for (let c=0; c<levels_brick[elegxos].column;c++){
           for (let r=0; r<levels_brick[elegxos].row;r++){
              
               bricks[c][levels_brick[elegxos].difficulty]={status:2};
               bricks[c][difficulty]={status:2};
               
           }}}
       else if(levels_brick[elegxos].level==3){
           for (let c=0; c<levels_brick[elegxos].column;c++){
               for (let r=0; r<levels_brick[elegxos].row;r++){
                  
                   bricks[c][levels_brick[elegxos].difficulty]={status:2};
                   bricks[c][difficulty]={status:2};
                   bricks[c][difficulty-1]={status:2};

                   
               }}
       }
       else if(levels_brick[elegxos].level==4){
           for (let c=0; c<levels_brick[elegxos].column;c++){
               for (let r=0; r<levels_brick[elegxos].row;r++){
                  
                   bricks[c][levels_brick[elegxos].difficulty]={status:2};
                   bricks[c][difficulty]={status:2};
                   
                   bricks[c][difficulty-1]={status:2};  }}}
           else if(levels_brick[elegxos].level==3){
           for (let c=0; c<levels_brick[elegxos].column;c++){
               for (let r=0; r<levels_brick[elegxos].row;r++){
                  
                   bricks[c][difficulty]={status:1};
                   bricks[c][difficulty-1]={status:2};
                   bricks[c][difficulty-2] ={status:3};
   }}}}
   
);
    
function draw(){
    contx.drawImage(images.background,0, 0,canv.width,canv.height);
     drawBall();
     drawPandle();  
     deije_levels();
     score_ever();
     brick_dwse();
     epistrofes();
     deije_lives();
     epistrofes_pandle_ball(); 
     move_pandle();
     duskolia();    
     epistrofes_canvas_panle_ball_zwes();
    move_ball();
    power_up_zwes();
   
   
  
    
    
if(pause){
    audio.game_audio.pause();
    contx.font = "25px Helvetica";
    contx.fillText("Game paused!",canv.width/2, canv.height/2);
    contx.fill();
}
else{
    
    requestAnimationFrame(draw);}
  
};







   

