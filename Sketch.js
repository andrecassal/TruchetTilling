//https://pdfs.semanticscholar.org/5329/45da714768a106096cf2537293a012898a0e.pdf?_ga=2.66342185.60090947.1598500660-609679664.1598500660
let img, canvas, pp;

function preload(){
	// img = loadImage("frida.jpg");
	img = loadImage("Che.PNG");
	// img = loadImage("monalisa-2.jpg");
	// img = loadImage("Abraham-Lincoln.jpg");
	// img = loadImage("Muybridge_race_horse_animated.gif");
	// img = loadImage("Frankenstein.jpg");
}

let temp;


function setup() {
	img.resize(0,windowHeight)
	// img.resize(width,0)
	// canvas = createCanvas(windowWidth, windowHeight);
	canvas = createCanvas(img.width,img.height)
	background(0);
	// background(255)
	
	// fill(255);
	fill(0)
	noStroke();
	
	// image(img,0,0)
	
	// temp = createGraphics(width,height);
	// temp.textAlign(CENTER,CENTER);
	// temp.textStyle(BOLD)
	// temp.textSize(400)
	// temp.text("10",temp.width/2,temp.height/2)
	
	// temp.image(temp,0,0)
	
	pp = new PatternGrid(img,img.width,img.height);
	// pp = new PatternGrid(img)
	// pp = new PatternGrid();
	pp.setBlk(15);
	pp.engine = new LineBlock();
	pp.onSetup = function(){
		this.blob.resize(0,this.row);
		// this.blob.filter(GRAY)
		// this.blob.filter(BLUR,1)
		// this.blob.filter(POSTERIZE,6);
		this.engine.col = this.col;
		this.engine.row = this.row;
		this.engine.setBlk(this.blk);
	}
	pp.prev = null;
	pp.curr = null

	pp.onRenderItem = function(x,y){
		push();
		translate(x,y);
		this.engine.xi = this.xi;
		this.engine.yi = this.yi;
		this.engine.intensity = this.blob.get(this.xi,this.yi)[0];
		this.engine.render()
		pop();
	}
	
	// pp.onSetup=function(){}
	// pp.noiseScl = 0.05;
	// pp.onRenderItem = function(x,y){
	// 	push();
	// 	translate(x,y);
	// 	this.engine.xi = this.xi;
	// 	this.engine.yi = this.yi;
	// 	this.engine.intensity = noise(this.xi*this.noiseScl,this.yi*this.noiseScl) * 255;
	// 	this.engine.render()
	// 	pop();
	// }
	
	// pp.onRenderItem = function(x,y){
	// 	let B = this.blk;
	// 	let M = this.blk*0.65;
	// 	let px = this.blob.get(this.xi,this.yi);
	// 	let I = map(px[0],30,230, M,-M, true);
	// 	let rota = this.xi%2 + (this.yi%2 ? 2 : 0);
	// 	push();
	// 	translate(x,y);
	// 	switch(rota){
	// 		case 0: break;
	// 		case 1: 
	// 			translate(0, B);
	// 			rotate(-HALF_PI);
	// 			break;
	// 		case 2:
	// 			rotate(HALF_PI);
	// 			translate(0,-B);
	// 			break;
	// 		case 3:
	// 			translate(B,B)
	// 			rotate(PI)
	// 			break;
	// 	}
	// 	noStroke();
	// 	fill(this.clr);
	// 	beginShape();
	// 	vertex(0,0);
	// 	vertex(B,0);
	// 	quadraticVertex(M+I,M+I, 0,B);
	// 	endShape();
	// 	pop();
	// }
	
	
	
	
	// pp.render();
	// frameRate(15);
	noLoop();
}


function draw(){
	background(255)
	pp.render();	
	// pp.blob.nextFrame();
}








class PatternGrid{
	constructor(blob,w,h){
		this.blob = blob;
		this.width = w || width;
		this.height = h || height;
		this.clr = color(0);
		this.data = [];
		this.setBlk(10);
	}
	setBlk(v){
		this.blk = v;
		this.blk2 = v * 0.5;
		this.blk4 = v * 0.25;
		this.scanBlk = v;
		this.col = round(this.width / this.blk);
		this.row = round(this.height / this.blk);
	}
	render(){
		if(this.onSetup){this.onSetup();}
		if(this.engine){
			this.engine.setBlk( this.blk );
		}
		
		let x,y;
		let xb=this.blk, yb=this.blk;
		for(y=0;y<this.row;y++){
			for(x=0;x<this.col;x++){
				this.xi = x;
				this.yi = y;
				this.onRenderItem(x*xb,y*yb);
			}
		}
	}
	// onSetup(){}
	// onRenderItem(x,y,px){}
}





function mousePressed(){
	saveCanvas(canvas,"TruchetTile","png");
}




p5.Image.prototype.nextFrame = function(){
	let f = this.getCurrentFrame();
	if(f>=img.numFrames()-1){
		f = -1;
	}
	return this.setFrame(++f);
}


	
	
	
	
