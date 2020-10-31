class RenderEngine{
	constructor(){
		this.blk = null;
		this.blk2 = null;
		this.intensity=1;
		this.bg = color(0);
		this.fg = color(255);
	}
	setBlk(blk){
		this.blk = blk;
		this.blk2 = blk/2;
	}
	base(bgOrFg){
		let bg = bgOrFg ? this.fg : this.bg;
		let fg = bgOrFg ? this.bg : this.fg;
		fill(bg)
		rect(0,0, this.blk, this.blk);
		fill(fg);
		return [bg,fg];
	}
	L2R(clr){
		push();
		this.base(clr);
		pop();
	}
	R2L(clr){
		push();
		this.base(clr);
		pop();
	}
}	
	

class RoundedSquares extends RenderEngine{
	base(x,y){
		let s = 1;
		let blk = this.blk - s;
		let max = this.blk * map(this.intensity,0,255,2,0);

		fill(lerpColor(color(239, 0, 52),color(239, 200, 252), map(this.intensity,0,255,0,1)))
		rect(s,s,blk,blk, max,max,max,max)
	}
	render(){
		let x = this.xi % 2 == 0;
		let y = this.yi % 2 == 0;
		this.base(x,y);
	}
}


class Arcs extends RenderEngine{
	render(){
		let B = this.blk;
		let S = B * 0.3;
		let U = B * 2;
		noStroke();
		fill(0)
		// fill( this.palette.random() )
		ellipseMode(CENTER);

		switch(random([0,1,2,3])){
			case 0:
				translate(B,0)
				scale(-1,1);
				break;
			case 1:
				translate(B,0)
				rotate(HALF_PI)
				break;
			case 2:
				translate(0,B)
				scale(1,-1);
				break;
			case 3:
			default:
				translate(B,B)
				scale(-1,-1);
				break;
		}
		arc(0,0, U,U, 0,HALF_PI, PIE);
	}
}



class TextBlocks extends RenderEngine{
	constructor(){
		super();
		this.SPACE = " ";
		this.index=0;
		this.re =  /[,;!?:.]/ig;
		this.content="You ask, what is our policy? I can say: It is to wage war, by sea, land and air, with all our might and with all the strength that God can give us; to wage war against a monstrous tyranny, never surpassed in the dark, lamentable catalogue of human crime. That is our policy.",	
		this.content = this.content.toUpperCase();
		this.content = this.content.replace(this.re,"");
	}
	next(){
		if(this.index >= this.content.length){
			this.index=0;
			return this.SPACE;
		}
		return this.content[this.index++];
	}
	text(){
		let T = this.next();
		if(this.xi == 0 && T == this.SPACE){
			T = this.next();
		}
		return T;
	}
	render(){
		let B = this.blk;
		let F = this.blk * 0.6;
		let T = this.text();
		let bg = this.fg;
		let fg = this.bg;
		
		push();
		if(this.intensity < 90){
			fg = this.fg;
			bg = this.bg;
		}
			
		if(T){
			stroke(0);
			fill(bg);
			rect(0,0, B,B);
			textAlign(CENTER,CENTER);
			textSize(F);
			textStyle(BOLD);
			fill(fg);
			noStroke();
			text(T,this.blk2,this.blk2)
		}
		pop();
	}
}

class LineBlock extends RenderEngine{
	render(){
		let B = this.blk;
		let H = map(this.intensity,0,255,this.blk,0);
		let T = map(H,this.blk,0, 30,0);
		// stroke(255)
		quad(	0,0,
				 	B,0,
				 	B+T,H,
					T,H);
	}
}

class DoubleDots extends RenderEngine{
	render(){
		let A = 0.9;
		let C = 0.4;
		let B1 = this.blk*A;
		let B2 = this.blk*map(this.intensity,0,255,A,C);
		
		let B = this.xi % 2 ? B2 : B1;
		if(this.yi % 2){
			B = this.xi % 2 ? B1 : B2;
		}
		
		translate(this.blk2,this.blk2);
		ellipseMode(CENTER);
		ellipse(0,0, B, B);
	}
}

class BrushLines extends RenderEngine{
	render(){
		noStroke();
		fill(0);
		let M1 = this.blk * 0.1;
		let M2 = this.blk * 0.4;
		let ii = map(this.intensity,0,255,M2,M1)
		ellipseMode(CENTER);
		let x = this.blk2;
		let w = this.blk * 0.1;
		let s = 0;
		for(let y=0;y<=this.blk;y+=random(3)){
			s = ii + random(M1);
			ellipse(x+random(-w,w), y, s, s)
		}
	}
}




	
class PatternBlock extends RenderEngine{	
	constructor(){
		super();
		this.data = [];
	}
	render(){

		let II = this.intensity;		
		let BLACK = 0;
		let WHITE = 1;
		
		//0 for black and 1 for gray and white
		let V = II > 127 ? WHITE : BLACK;
		
		//if first tile, prev is the tile above;
		if(this.xi == 0 && this.yi > 0){
			this.prev = this.data[ this.data.length - this.col ]
		}

		//simulating dithering
		//if pixel black, look at previous
		//find matching object;
		if(V == BLACK){
			switch(this.prev){
				case 1: 	this.curr = 2; break;
				case 2: 	this.curr = 1; break;
				case 3: 	this.curr = 1; break;
				case 4: 	this.curr = 2; break;
				default:	this.curr = random([1,2]);
			}
		}else if(V == WHITE){
			switch(this.prev){
				case 1: 	this.curr = 3; break;
				case 2: 	this.curr = 4; break;
				case 3: 	this.curr = 4; break;
				case 4: 	this.curr = 3; break;
				default:	this.curr = random([3,4]);
			}
		}
		
		//save in data
		this.data.push(this.curr);
		this.prev = this.curr;
		
		switch(this.curr){
			case 1: this.L2R(BLACK,II); break;
			case 2: this.R2L(BLACK,II); break;
			case 3: this.L2R(WHITE,II); break;
			case 4: this.R2L(WHITE,II); break;
		}

	}
}


class Lines extends PatternBlock{
	stk(intensity){
		return map(intensity,0,255, 14,1,true);
	}
	mult(intensity){
		return map(intensity,30,255, 0.9, 0, true);
	}
	base(bgOrFg){
		return [this.bg,this.fg];
	}
	L2R(clr, intensity){
		let B = this.blk;
		let Z = this.blk2 * this.mult(intensity);
		let [bg,fg] = this.base(clr);
		stroke(bg);
		strokeWeight(this.stk(intensity))
		line(0,0, Z,Z)
		line(B,B, B-Z,B-Z)
	}
	R2L(clr, intensity){
		let B = this.blk;
		let Z = this.blk2 * this.mult(intensity);
		let [bg,fg] = this.base(clr);
		stroke(bg);
		strokeWeight(this.stk(intensity))
		line(B,0, B-Z,Z);
		line(0,B, Z,B-Z);
	}	
	
}


class Crosses extends PatternBlock{
	L2R(clr){
		push();
		let B = this.blk;
		let Z = this.blk2 * 0.8;
		this.base(clr);
		translate(this.blk2,this.blk2);
		rectMode(CENTER);
		rotate(clr ? 0 : QUARTER_PI);
		rect(0,0, Z,B)
		rect(0,0, B,Z)
		pop();
	}
	L2R(clr){
		push();
		let B = this.blk;
		let Z = this.blk2 * 0.5;
		this.base(clr);
		translate(this.blk2,this.blk2);
		rectMode(CENTER);
		rotate(clr ? 0 : QUARTER_PI);
		rect(0,0, Z,B)
		rect(0,0, B,Z)
		pop();
	}
	
}


class Pluses extends PatternBlock{
	mult(intensity, side){
		return this.blk2 * map(intensity,50,200, 1.5, 0.1, true) * side;
	}
	base(clr){
		stroke(0);
	}
	L2R(clr, intensity){
		let B = this.blk;
		let B2 = this.blk2;
		let Z  = this.mult(intensity, 0.75);
		this.base(clr);
		strokeWeight(Z);
		line(B2,0, B2,B)
		line(0,B2, B,B2)
	}
	R2L(clr, intensity){
		let B = this.blk;
		let B2 = this.blk2;
		let Z  = this.mult(intensity, 0.1);
		this.base(clr);
		strokeWeight(Z);
		line(B2,0, B2,B)
		line(0,B2, B,B2)
	}
}


class Squares extends PatternBlock{
	L2R(clr){
		let B = this.blk;
		let Z  = this.blk2 * 0.65;
		this.base(clr);
		rect(0,0, Z,Z)
		rect(B-Z,B-Z, Z,Z)
	}
	R2L(clr){
		let B = this.blk;
		let Z  = this.blk2 * 0.65;
		this.base(clr);
		rect(B-Z,0, Z,Z);
		rect(0,B-Z, Z,Z);
	}
}


class Circles extends PatternBlock{
	L2R(clr){
		push();
		this.base(clr);
		let B = this.blk;
		arc(0,0, B,B, 0, HALF_PI);
		arc(B,B, B,B, PI, -HALF_PI);
		pop();
	}
	R2L(clr){
		push();
		this.base(clr);
		let B = this.blk;
		arc(B,0, B,B, HALF_PI, PI);
		arc(0,B, B,B, -HALF_PI, 0);
		pop();
	}
}


class Diamonds extends PatternBlock{
	L2R(clr){
		this.base(clr);
		let B = this.blk;
		let Z = this.blk2;
		triangle(0,0, Z,0, 0,Z);
		triangle(B,Z, B,B, Z,B);
	}
	R2L(clr){
		this.base(clr);
		let B = this.blk;
		let Z = this.blk2;
		triangle(Z,0, B,0, B,Z);
		triangle(0,Z, 0,B, Z,B);
	}
}


class Donuts extends PatternBlock{
	
	L2R(clr){
		let [bg,fg] = this.base(clr);
		let B = this.blk;
		let Z = this.blk2;
		arc(0,0, B,B, 0, HALF_PI);
		fill( bg );
		arc(0,0, Z,Z, 0, HALF_PI);
		fill( fg );
		arc(B,B, B,B, PI, -HALF_PI);
		fill( bg );
		arc(B,B, Z,Z, PI, -HALF_PI);
	}
	R2L(clr){
		let [bg,fg] = this.base(clr);
		let B = this.blk;
		let Z = this.blk2;
		arc(B,0, B,B, HALF_PI, PI);
		fill( bg );
		arc(B,0, Z,Z, HALF_PI, PI);
		fill( fg );
		arc(0,B, B,B, -HALF_PI, 0);
		fill( bg );
		arc(0,B, Z,Z, -HALF_PI, 0);
	}	
}


class MultCircle extends PatternBlock{
	base(bgOrFg){
		// let bg = bgOrFg ? this.bg : this.fg;
		// let fg = bgOrFg ? this.fg : this.bg;
		fill(this.fg)
		stroke(this.bg)
	}
	circle(X,Y, S,E, II){
		let C = this.blk * 1.3;
		let Z = this.blk * map(II,0,255,0.5,0.9);
		let U = map(II,0,255,4,0.5)
		strokeWeight(U);
		strokeCap(ROUND);
		for(let i=C;i>=0;i-=Z){
			arc(X,Y, i,i, S,E);
		}	
	}
	L2R(clr, intensity){
		push();
		let B = this.blk;
		this.base(clr);
		this.circle(0,0, 0,HALF_PI, intensity);
		this.circle(B,B, PI,-HALF_PI, intensity);
		pop();
	}
	R2L(clr, intensity){
		push();
		let B = this.blk;
		this.base(clr);
		this.circle(B,0, HALF_PI,PI, intensity);
		this.circle(0,B, -HALF_PI,0, intensity);
		pop();
	}
}


class Knots extends PatternBlock{
	base(clr,intensity){
		noFill();
		stroke(0);
		strokeWeight(map(intensity,0,255,5,0,true))
		// strokeWeight(2)
	}
	mult(intensity){
		return this.blk * map(intensity,0,255,1,0.6);
	}
	L2R(clr, intensity){
		push()
		let B = this.blk;
		let U = this.mult(intensity);
		this.base(clr,intensity);
		beginShape();
		vertex(U,0)
		vertex(U,U)
		vertex(0,U);
		endShape();
		
		beginShape();
		vertex(B,B-U)
		vertex(B-U,B-U)
		vertex(B-U,B)
		endShape();		

		pop()
	}
	R2L(clr, intensity){
		push()
		let B = this.blk;
		let U = this.mult(intensity);
		let R = 0.8;
		this.base(clr,intensity);
		beginShape();
		vertex(B-U,0)
		vertex(B-U,U)
		vertex(B,U);
		endShape();
		
		beginShape();
		vertex(0,B-U)
		vertex(U,B-U)
		vertex(U,B)
		endShape();		
		pop()
	}
}


class SquaredDiamonds extends PatternBlock{

	base(clr, II, side){
		let B = this.blk;
		let Z = this.blk2;
		let U = this.blk * 0.8;
		let R = PI/7;
		noFill();
		stroke(0);
		// strokeWeight(1)
		strokeWeight(map(II,0,255, 3,0, true));
		rectMode(CENTER);
		translate(Z,Z);
		push();
		rotate(R * side * 1);
		rect(0,0, U,U);
		pop();
		push();
		rotate(R * side * -1);
		rect(0,0, U,U);
		pop();		
	}
	L2R(clr, intensity){
		this.base(clr, intensity, 1)
	}
	R2L(clr, intensity){
		this.base(clr, intensity, -1)
	}
}


class Quads extends PatternBlock{
	base(clr, intensity, side){
		let B = this.blk;
		let M = this.blk2;
		let I = map(intensity, 0,255, this.blk2,0);
		let S1 = side ? 0 : B;
		let S2 = side ? B : 0;
		// triangle(S1,0, S2,M, S2,B);
		quad(0,M-I, B,0, B,M+I, 0,B)
	}
	L2R(clr, intensity){
		this.base(clr,intensity, 1)
	}
	R2L(clr, intensity){
		this.base(clr,intensity, 0)
	}
}


class QuadraticLeafs extends PatternBlock{
	base(){
		let B = this.blk;
		let M = B * 0.5;
		translate(M,M)
		rotate( map(this.intensity, 40,200, -PI,PI, true) )
		translate(-M,-M)
		stroke(0)
		strokeWeight(map(this.intensity,40,200, M,0, true))
		beginShape();
		vertex(M,0);
		quadraticVertex(B,M, M,B);
		quadraticVertex(0,M, M,0);
		endShape();
	}
	L2R(){
		this.base()
	}
	R2L(){
		this.base()
	}
}


class SideTriangles extends PatternBlock{
	L2R(clr){
		let B = this.blk;
		let M = this.blk2;
		let I = map(this.intensity,0,200,M,-M,true)
		quad(0,M-I, B,0, B,B, 0,M+I)
	}
	R2L(clr){
		let B = this.blk;
		let M = this.blk2;
		let I = map(this.intensity,0,200,M,-M,true)
		quad(0,0, B,M-I, B,M+I, 0,B)
	}
}


class Rect3d extends PatternBlock{
	base(clr){
		stroke(0)
		strokeWeight(map(this.intensity,40,200,5,0,true));
		fill(255)
	}
	L2R(){
		this.base();
		let B = this.blk;
		let M = this.blk2;
		quad(M,0, B,M, B,B, M,M)
		quad(0,M, M,B, B,B, M,M)
		rect(0,0,M,M)
	}
	R2L(){
		this.base();
		let B = this.blk;
		let M = this.blk2;
		quad(M,0, 0,M, 0,B, M,M)
		quad(M,M, B,M, M,B, 0,B)
		rect(M,0,M,M)
	}
}


class Triangle3 extends RenderEngine{
	render(){
		let S = this.blk * 0.2;
		S = map(this.intensity,0,255, 0, S, true);
		let B = this.blk
		let S1 = S;
		let S2 = B-S;
		push();
		fill(0)
		let x = this.xi % 2 == 0;
		let y = this.yi % 2 == 0;
		if(y && x){
			translate(B,B)
			scale(-1,-1)
		}else if(y){
			translate(0,B)
			scale(1,-1)
		}else if( x ){
			translate(B,0)
			scale(-1,1)
		}
		rect(0,0, S,S)
		quad(S1,S1, B,0, S2,S2, 0,B)
		rect(S2,S2, S,S)
		pop();
	}
}


class AngledLines extends RenderEngine{
	render(){
		let side = this.yi % 2;
		let B = this.blk;
		let U = B * (side ? 0.8 : 0.2);
		let Q = B * (!side ? 0.8 : 0.2);
		stroke(0)
		strokeCap(SQUARE)
		strokeWeight(map(this.intensity,0,255,10,2))
		if(side){
			translate(this.blk2,0)
		}
		line(U,0, Q,B)
	}
}

class AngledLines2 extends RenderEngine{
	render(){
		let A = this.blk;
		let B = this.blk*0.05;
		let M = map(this.intensity,0,255,A,B)
		
		// translate(this.blk2,this.blk2);
		stroke(0);
		strokeCap(ROUND)
		strokeWeight(this.blk*0.5)
		line(0,0, M,M);
	}
}

class AngledLines3 extends RenderEngine{
	render(){
		let B = this.blk;
		let S1 = B*0.6;
		let S2 = 1
		let S = map(this.intensity,0,255,S1,S2)
		
		stroke(0);
		strokeWeight(S)
		line(0,0, 0,B)
		line(0,0, B,B);
	}
}


class AngledQuads extends RenderEngine{
	render(){
		let B = this.blk;
		let I = map(this.intensity,30,230,this.blk*0.3,0)
		let M1 = this.blk * 0.25 - I;
		let M2 = this.blk * 0.75 + I;
		let S = this.blk * 0.2;
		if(this.yi % 2){
			translate(this.blk2,0)
			S *= -1;
		}
		quad(M1+S,0, M2+S,0, M2-S,B, M1-S,B)
	}
}


class AngledTriangles extends RenderEngine{
	render(){
		let B = this.blk;
		let I = map(this.intensity,30,230,this.blk2,0)
		let M = this.blk2;
		if(this.yi % 2){
			quad(0,0, B,M-I, B,M+I, 0,B)
		}else{
			quad(0,M-I, B,0, B,B, 0,M+I)
		}
	}
}


class HandyDots extends RenderEngine{
	render(){
		let A = map(this.intensity,50,200, 100,0,true)
		stroke(0)
		strokeWeight(3)
		for(let i=0;i<A;i++){
			point(random(this.blk),random(this.blk))
		}
	}
}


class HandyLines extends RenderEngine{
	render(){
		let A = map(this.intensity,50,200, 2,5,true)
		let D = this.blk * 0.3;
		let wiggle = this.blk * 0.1;
		stroke(0)
		strokeWeight(1)
		let ye = this.blk+D+D;
		for(let x=0;x<=this.blk;x+=A){
			beginShape()
			for(let y = -D;y<ye;y+=D){
				curveVertex(x+random(-wiggle,wiggle),y)
			}
			endShape()
		}
	}
}


class CairoPentagons extends PatternBlock{
	base(side){
		let B = this.blk;
		let Q = B * 0.2;
		let Z = B - Q;
		push();
		noFill();
		stroke(0);
		strokeWeight(1);
		let xi = this.xi % 2;
		let yi = this.yi % 2;
		
		if(xi && yi){
			translate(B,B);
			scale(-1,-1);
		}else if(xi){
			translate(B,0);
			scale(-1,1);
		}else if(yi){
			translate(0,B);
			scale(1,-1);
		}
		
		// rect(0,0, B,B);
		strokeWeight(map(this.intensity,0,255,3,0));
		line(Z,0, Q,B);
		line(0,Q, B,Z);
		pop();
	}
	L2R(){
		this.base(1);
	}
	R2L(){
		this.base(0);
	}
	
}


class QuadraticSquares extends PatternBlock{
	base(bgOrFg, intensity){
		let B = this.blk;
		let M = this.blk2;
		let Q = this.blk2 * 0.5;
		let I = map(intensity,0,255, Q, 0);
		beginShape();
		vertex(Q-I,Q-I)
		quadraticVertex(M,M-I, M+Q+I,	Q-I)
		quadraticVertex(M+I,M, M+Q+I,	M+Q+I)
		quadraticVertex(M,M+I, Q-I,		M+Q+I)
		quadraticVertex(M-I,M, Q-I,Q-I)
		endShape()		
	}
	L2R(clr, intensity){
		this.base(clr, intensity, 1)
	}
	R2L(clr, intensity){
		this.base(clr, intensity, 0)
	}
	
}


class Leafs2 extends PatternBlock{
	base(intensity){
		let B = this.blk * 0.8;
		let U = this.blk * map(intensity,0,255,0.75,0.1);
		push();
		translate(this.blk2,0)
		rotate( map(this.xi,0,this.col,PI,0) );
		// ellipseMode(CORNERS);
		ellipse(0,0,U,B);
		pop();
	}
	L2R(clr,intensity){
		this.base(intensity)
	}
	R2L(clr,intensity){
		this.base(intensity);
	}
	
}


class QuadraticCorners extends RenderEngine{
	render(){
		let B = this.blk;
		let M = this.blk*0.65;
		let px = this.intensity;
		let I = map(px,30,230, M,-M, true);
		let rota = this.xi%2 + (this.yi%2 ? 2 : 0);
		push();
		switch(rota){
			case 0: break;
			case 1: 
				translate(0, B);
				rotate(-HALF_PI);
				break;
			case 2:
				rotate(HALF_PI);
				translate(0,-B);
				break;
			case 3:
				translate(B,B)
				rotate(PI)
				break;
		}
		noStroke();
		fill(0);
		beginShape();
		vertex(0,0);
		vertex(B,0);
		quadraticVertex(M+I,M+I, 0,B);
		endShape();
		pop();

	}
}


class HalfMoons extends RenderEngine{
	render(){
		let B = this.blk * 0.90;
		let U = this.blk2;
		let M = this.blk * 0.025;
		let I = map(this.intensity,0,255, 0, HALF_PI);
		translate(U,U);
		rotate(random([0,HALF_PI]));
		switch(random([0,1])){
			case 0:
				arc(-M,0, B, B, HALF_PI+I, -HALF_PI-I);
				arc(+M,0, B, B, -HALF_PI+I, HALF_PI-I);
				break;
			case 1:
				arc(-U+M+M,0, B, B, -HALF_PI+I, HALF_PI-I);
				arc(U-M,0, B, B, HALF_PI+I, -HALF_PI-I);
				break;
		}
	}
}


class PlayStation extends RenderEngine{
	render(){
		push();
		this.S = this.blk * 0.05;
		this.B = this.blk * 0.9 - this.S * 2;
		this.U = this.B / 2;
		noFill();
		stroke(0);
		// strokeCap(SQUARE);
		strokeWeight(this.S*2);
		switch(random([0,1,2,3])){
			case 0: this.triangle(); break;
			case 1: this.rect(); break;
			case 2: this.ellipse(); break;
			case 3: this.cross(); break;
		}
		pop();
	}
	triangle(){
		triangle(this.U,this.S, this.B,this.B, 0,this.B);
	}
	rect(){
		rect(this.S,this.S, this.B,this.B);
	}
	ellipse(){
		ellipse(this.U,this.U, this.B,this.B);
	}
	cross(){
		line(this.S,this.S, this.B,this.B);
		line(this.S,this.B, this.B,this.S);
	}
}






