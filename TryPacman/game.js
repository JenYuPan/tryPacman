const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animationss");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x,y,width,height,color) =>{
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x,y,width,height)
};

let fps = 30;
let BlockSize = 20;
let wallColor ="#FFFFFF";
let wallSpaceWidth = BlockSize/1.5;
let wallOffset=(BlockSize-wallSpaceWidth)/2;
let wallInnerColor ="#000000";
let foodColor ="#ADFF2F";
let score=0;
let ghosts=[];
let ghostImageLocation=[
    {x:0,y:0},
    {x:97,y:0},
    {x:0,y:99},
    {x:97,y:99},
]
let ghostCount=4;
let lives = 3;
let foodCount=0;


const DIRECTION_UP=3;
const DIRECTION_RIGHT=4;
const DIRECTION_LEFT=2;
const DIRECTION_BOTTOM=1;




let map = [

    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1],
    [2,2,2,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,2,2,2],
    [1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,1,1,1],
    [2,2,2,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,2,2,2],
    [2,2,2,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,2,2,2],
    [1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,0,1],
    [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
for(let i=0;i<map.length;i++){
    for(let j=0;j<map[0].length;j++){
        if(map[i][j]==0){
            foodCount++;
        }
    }
}



let randomTargetsForGhosts=[
    {x:1*BlockSize,y:1*BlockSize},
    {X:1*BlockSize,y:(map.length-2)*BlockSize},
    {x:(map[0].length-2)*BlockSize,y:BlockSize},
    {x:(map[0].length-2)*BlockSize,y:(map.length-2)*BlockSize},
];

let gameLoop = ()=>{
    draw();
    update();
};

let update =()=>{
    pacman.moveProcess();
    pacman.eatProcess();

    for(let i =0;i<ghosts.length;i++){
        ghosts[i].moveProcess();
    }
    if(pacman.checkGhostCollision()){
        console.log("hit");
        restartGame();
    }
    if(score>=foodCount){
        drawWin();
        clearInterval(gameInterval);
    }
};

let restartGame=()=>{
    createNewPacman();
    createGhosts();
    lives--;
    if(lives==0){
        gameOver();
    }
}


let gameOver=()=>{
    drawGameOver();
    clearInterval(gameInterval);
};

let drawGameOver=()=>{
    canvasContext.font="20px Verdana"
    canvasContext.fillStyle="white"
    canvasContext.fillText("Game Over!!",150,225);
}

let drawWin=()=>{
    canvasContext.font="20px Verdana"
    canvasContext.fillStyle="white"
    canvasContext.fillText("!You Win!",160,225);
}

let drawLives=()=>{
    canvasContext.font="20px Verdana"
    canvasContext.fillStyle="white"
    canvasContext.fillText("LIVES:",250,BlockSize*(map.length+1)+5);
    for(let i =0;i<lives;i++){
        canvasContext.drawImage(
            pacmanFrames,
            2*BlockSize,
            0,
            BlockSize,
            BlockSize,
            350+i*BlockSize,
            BlockSize*map.length+8,
            BlockSize,
            BlockSize
        )
    }
};
let drawFoods =() =>{
    for(let i=0;i<map.length;i++){
        for(let j=0;j<map[0].length;j++){
            if(map[i][j]==0){
                createRect(
                    j * BlockSize + BlockSize / 3,
                    i * BlockSize + BlockSize / 3,
                    BlockSize/5,
                    BlockSize/5,
                    foodColor
                );
            }
        }
    }
}

let drawScore=()=>{
    canvasContext.font="20px Verdana";
    canvasContext.fillStyle="white";
    canvasContext.fillText(
        "SCORE:"+score,0,BlockSize*(map.length+1)+5
    );

}
let drawGhosts=()=>{
    for(let i=0;i<ghosts.length;i++){
        ghosts[i].draw();
    }
};
let draw =()=>{
    createRect(0,0,canvas.width,canvas.height,"black");
    drawWalls();
    pacman.draw();
    drawFoods();
    drawScore();
    drawGhosts();
    drawLives();

};
let gameInterval =setInterval(gameLoop,1000/fps);
let drawWalls =() =>{
    for(let i =0;i<map.length;i++){
        for(let j=0;j<map[0].length;j++){
            if(map[i][j]==1){
                createRect(
                    j*BlockSize,
                    i*BlockSize,
                    BlockSize,
                    BlockSize,
                    wallColor
                );//ªø*Àð¾À¡A¼e*Àð¾À¡AÀð¾Àªø¼e¡AÀð¾Àªø¼e¡AÀð¾ÀÃC¦â
                if(j>0&&map[i][j-1]==1){
                    createRect(
                        j*BlockSize,
                        i*BlockSize+wallOffset,
                        wallOffset+wallSpaceWidth,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if(j<map[0].length-1&&map[i][j+1]==1){
                    createRect(
                        j * BlockSize + wallOffset,
                        i * BlockSize + wallOffset, 
                        wallOffset+wallSpaceWidth,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if(i>0&&map[i-1][j]==1){
                    createRect(
                        j*BlockSize+wallOffset,
                        i*BlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth +wallOffset,
                        wallInnerColor
                    );
                }
                if(i<map[0].length-1&&map[i+1][j]==1){
                    createRect(
                        j * BlockSize + wallOffset,
                        i * BlockSize +wallOffset, 
                        wallSpaceWidth,
                        wallSpaceWidth+wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

let createNewPacman = () =>{
    pacman = new Pacman(
        BlockSize,
        BlockSize,
        BlockSize,
        BlockSize,
        BlockSize/5
    )
}
let createGhosts =()=>{
    ghosts = []
    for(let i=0;i<ghostCount;i++){
        let newGhost=new Ghost(
            9*BlockSize+(i%2==0?0:1)*BlockSize,
            10*BlockSize+(i%2==0?0:1)*BlockSize,
            BlockSize,
            BlockSize,
            pacman.speed/2,
            ghostImageLocation[i % 4].x,
            ghostImageLocation[i % 4].y,
            110,
            108,
            6+i
        );
        ghosts.push(newGhost);
    }
    
};
createNewPacman();
createGhosts();
gameLoop();
window.addEventListener("keydown",(event)=>{
    let k = event.keyCode;
    setTimeout(()=>{
        if(k==37||k==65){//¥ª
            pacman.nextDirection=DIRECTION_LEFT;
        }else if(k==39||k==68){//¥k
            pacman.nextDirection=DIRECTION_RIGHT;
        }else if(k==38||k==87){//¤W
            pacman.nextDirection=DIRECTION_UP;
        }else if(k==40||k==83){//¤U
            pacman.nextDirection=DIRECTION_BOTTOM;
        // }else{
        //     k==null;
        }
    },1);
});