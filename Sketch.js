//https://pdfs.semanticscholar.org/5329/45da714768a106096cf2537293a012898a0e.pdf?_ga=2.66342185.60090947.1598500660-609679664.1598500660
let img, canvas, pp;

p5.Image.prototype.nextFrame = function(){
	let f = this.getCurrentFrame();
	if(f>=img.numFrames()-1){
		f = -1;
	}
	return this.setFrame(++f);
}




function preload(){
	// img = loadImage("frida.jpg");
	// img = loadImage("Che.PNG");
	img = loadImage("monalisa-2.jpg");
	// img = loadImage("Abraham-Lincoln.jpg");
	// img = loadImage("Muybridge_race_horse_animated.gif");
	// img = loadImage("Frankenstein.jpg");
}


function setup() {
	img.resize(0,windowHeight)
	// img.resize(width,0)
	// canvas = createCanvas(windowWidth, windowHeight);
	canvas = createCanvas(img.width,img.height)
	background(0);
	// background(255)
	
	fill(0)
	noStroke();
	
	// image(img,0,0)
	
	
	pp = new Grid()
	pp.setImage(img);
	pp.setBlk(10);
	pp.onSetup = function(){
		this.img.resize(0,this.rows);
		this.engine = new QuadraticCorners();
		this.engine.setBlk(this.blk);
	}

	pp.onRenderItem = function(x,y){
		push();
		translate(x,y);
		this.engine.xi = this.xi;
		this.engine.yi = this.yi;
		this.engine.intensity = this.px(this.xi,this.yi);
		this.engine.render()
		pop();
	}
	
	noLoop();
}


function draw(){
	background(255)
	pp.render();	
	// pp.img.nextFrame();
}











function mousePressed(){
	saveCanvas(canvas,"TruchetTile","png");
}






	
	
	
	
