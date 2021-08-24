function Particle(x,y,xSpeed,ySpeed,size,f_colour,b_colour){
    
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour1 = f_colour;
    this.colour2 = b_colour;
    this.age = 0;
    
    this.drawParticle = function(){

        fill(this.colour1);
        noStroke();
        ellipse(this.x,this.y,this.size);
        
        fill(this.colour2);
        noStroke();
        ellipse(this.x,this.y,this.size/3);
        } 

    this.updateParticle = function(){

        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.age++;

    }  
}

function Emitter(x,y,xSpeed,ySpeed,size,f_colour,b_colour,isTouched){
    
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour1 = f_colour;
    this.colour2 = b_colour;
    
    this.startParticles = 0;
    this.lifetime = 0;
    
    this.particles = [];
    this.isTouched = false;
    
    this.addParticle = function(){
        var p = new Particle(random(this.x-10,this.x+10), 
                             random(this.y-1, this.y+1), 
                             random(this.xSpeed-1,this.xSpeed+1), 
                             random(this.ySpeed-1,this.ySpeed+1), 
                             random(this.size-2,this.size+2), 
                             this.colour1,this.colour2);
            return p;
    }
    this.startEmitter = function(startParticles,lifetime){
        this.startParticles = startParticles;
        this.lifetime = lifetime;
        
        //start emitter with initial particles
        for(var i = 0; i < startParticles; i++){
            
            this.particles.push(this.addParticle());
        }
    }    
    this.updateParticles = function(){
        //iterate through particles and draw to the screen
    
        var deadParticles = 0;
        for(var i = this.particles.length-1; i >= 0; i--){
            this.particles[i].drawParticle();
            this.particles[i].updateParticle();
            if(this.particles[i].age > random (0,this.lifetime)){
                this.particles.splice(i, 1);
                deadParticles++;
            }
        }       
        if(deadParticles > 0){
            for(var i = 0; i< deadParticles; i++){
                this.particles.push(this.addParticle());
            }         
        }
    }
    this.checkisTouched =  function(gamex,gamey){
        
        var d = dist(gamex,gamey,this.x,this.y);
               
        if(d < 50){ 
            if(!this.isTouched){
                 
                this.isTouched = true;
                
                return true;
            }
            return false;  
        }
       return false;   
    }  
}
