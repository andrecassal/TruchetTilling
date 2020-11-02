//https://pdfs.semanticscholar.org/5329/45da714768a106096cf2537293a012898a0e.pdf?_ga=2.66342185.60090947.1598500660-609679664.1598500660
let img, canvas, pp;

function preload(){
	// img = loadImage("frida.jpg");
	// img = loadImage("Che.PNG");
	// img = loadImage("monalisa-2.jpg");
	img = loadImage("Abraham-Lincoln.jpg");
	// img = loadImage("Muybridge_race_horse_animated.gif");
	// img = loadImage("Frankenstein.jpg");
}


function setup() {
	
	// img.resize(width,0)
	canvas = createCanvas(windowWidth, windowHeight);
	// canvas = createCanvas(img.width,img.height)
	img.resize(0,windowHeight)
	background(0);
	// background(255)
	
	fill(0)
	noStroke();
	
	// image(img,0,0)
	
	
	pp = new Grid()
	pp.setImage(img);
	pp.setBlk(15);
	pp.onSetup = function(){
		// this.engine = new HalfMoons();
		// this.engine = new HalfMoons();
		// this.engine = new BrushLines();
		// this.engine = new QuadraticSquares();
		// this.engine = new Leafs2();
		// this.engine = new QuadraticCorners();
		// this.engine = new HalfMoons();
		// this.engine = new AngledLines();
		// this.engine = new AngledLines2();
		// this.engine = new AngledLines3();
		// this.engine = new AngledQuads();
		// this.engine = new AngledTriangles();
		this.engine = new SpeechBlocks();
		this.engine.setImage(this.img);
		let blk = sqrt(this.w*this.h / this.engine.content.length);
		// let aw = floor((this.w/this.h) * blk);
		// let ah = floor((this.h/this.w) * blk);
		// $(blk*aw,blk*ah,blk,this.w,this.h)
		// this.engine.setBlk(aw,ah);
		// this.setBlk(aw,ah);
		this.engine.setBlk(blk)
		this.setBlk(blk)
		this.img.resize(0,this.rows);
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




p5.Image.prototype.nextFrame = function(){
	let f = this.getCurrentFrame();
	if(f>=img.numFrames()-1){
		f = -1;
	}
	return this.setFrame(++f);
}


function $(){
	console.log(Array.prototype.join.apply(arguments,[" | "]))
}
	
	
	







