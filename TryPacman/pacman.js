class Pacman{
    constructor(x,y,width,height,speed){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.speed=speed;
        this.direction=DIRECTION_RIGHT;
        this.nextDirection=this.direction;
        this.currentFrame=1;
        this.frameCount=7;

        setInterval(()=>{
            this.changeAnimation();
        },100);

    }
    moveProcess(){
        this.changeDirectionIfPossible();
        this.moveFrontside();
        if(this.checkCollision()){
            this.moveBackside();
            return;
        }
    }
    eatProcess(){
        for(let i=0;i<map.length;i++){
            for(let j=0;j<map[0].length;j++){
                if(map[i][j]==0 && this.getMapX()==j && this.getMapY()==i){
                    map[i][j]=3;
                    score++;
                }
            }
        }
    }
    moveBackside(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x-=this.speed;
                break;
            case DIRECTION_UP:
                this.y+=this.speed;
                break;
            case DIRECTION_LEFT:
                this.x+=this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y-=this.speed;
                break;
        }

    }
    moveFrontside(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x+=this.speed;
                break;
            case DIRECTION_UP:
                this.y-=this.speed;
                break;
            case DIRECTION_LEFT:
                this.x-=this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y+=this.speed;
                break;
        }

    }
    checkCollision(){
        if(
        map[this.getMapY()][this.getMapX()]==1 || 
        map[this.getMapYRightSize()][this.getMapX()]==1 ||
        map[this.getMapY()][this.getMapXRightSize()]==1 ||
        map[this.getMapYRightSize()][this.getMapXRightSize()]==1
        ){
            return true;
        }
        return false;
    }
    checkGhostCollision(){
        for(let i =0;i<ghosts.length;i++){
            let ghost = ghosts[i];
            if(ghost.getMapX()==this.getMapX()&&ghost.getMapY()==this.getMapY()){
                return true;
            }
        }
        return false;
    }
    changeDirectionIfPossible(){
        if(this.direction==this.nextDirection)
            return;
        let tempDirection = this.direction;
        this.direction=this.nextDirection;
        this.moveFrontside();
        if(this.checkCollision()){
            this.moveBackside();
            this.direction = tempDirection;
        } else {
            this.moveBackside();
        }
        return false;
    }
    changeAnimation(){
        this.currentFrame=this.currentFrame==this.frameCount ?1:this.currentFrame+1;
    }
    draw(){
        canvasContext.save();
        canvasContext.translate(
            this.x+BlockSize/2,
            this.y+BlockSize/2
        );
        canvasContext.rotate((this.direction*90*Math.PI)/180);
        canvasContext.translate(
            -this.x-BlockSize/2,
            -this.y-BlockSize/2
        );
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame-1)*BlockSize,
            0,
            BlockSize,
            BlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
    }

    getMapX(){
        return parseInt(this.x/BlockSize)
    }
    getMapY(){
        return parseInt(this.y/BlockSize)
    }
    getMapXRightSize(){
        return parseInt((this.x*0.9999+BlockSize)/BlockSize)
    }
    getMapYRightSize(){
        return parseInt((this.y*0.9999+BlockSize)/BlockSize)
    }

}