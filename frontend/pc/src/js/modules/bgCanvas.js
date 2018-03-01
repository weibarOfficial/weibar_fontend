(function(){
	window.bgCanvas = {
		index:null,
		obj:null,
		list:[],
		able:false,
		use:function(x){
			if(!this.able)
				return;
			if(this.index==x)
				return;
			this.close();
			this.index = x;
			if(this.list.length<=x)
				return;
			
			$('<div id="bgCanvas"></div>').appendTo($('body'));
			var obj = this.list[x];
			this.obj = new obj(document.getElementById('bgCanvas'));			
		},
		close:function(){
			var t = this;
			try{
				if(t.obj!=null)
					t.obj.close();
			}catch(ex){}
			$('#bgCanvas').remove();		
		},
		clear:function(){
			this.close();
			this.index = null;	
		},
		setAble:function(b){
			this.able = b;
			if(!b)
				this.clear();	
		}
	}
})();

//雪花
(function(){
	
var Particle3D=function(a){THREE.Particle.call(this,a);this.velocity=new THREE.Vector3(0,-8,0);this.velocity.rotateX(randomRange(-45,45));this.velocity.rotateY(randomRange(0,360));this.gravity=new THREE.Vector3(0,0,0);this.drag=1};Particle3D.prototype=new THREE.Particle;Particle3D.prototype.constructor=Particle3D;Particle3D.prototype.updatePhysics=function(){this.velocity.multiplyScalar(this.drag);this.velocity.addSelf(this.gravity);this.position.addSelf(this.velocity)};var TO_RADIANS=Math.PI/180;
THREE.Vector3.prototype.rotateY=function(a){cosRY=Math.cos(a*TO_RADIANS);sinRY=Math.sin(a*TO_RADIANS);a=this.z;var b=this.x;this.x=b*cosRY+a*sinRY;this.z=b*-sinRY+a*cosRY};THREE.Vector3.prototype.rotateX=function(a){cosRY=Math.cos(a*TO_RADIANS);sinRY=Math.sin(a*TO_RADIANS);a=this.z;var b=this.y;this.y=b*cosRY+a*sinRY;this.z=b*-sinRY+a*cosRY};
THREE.Vector3.prototype.rotateZ=function(a){cosRY=Math.cos(a*TO_RADIANS);sinRY=Math.sin(a*TO_RADIANS);a=this.x;var b=this.y;this.y=b*cosRY+a*sinRY;this.x=b*-sinRY+a*cosRY};function randomRange(a,b){return Math.random()*(b-a)+a};

var isOpen = false;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var container;
var particle;
var camera;
var scene;
var renderer;
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var particles = [];
var particleImage = new Image();

var mySnow = function(box){
	particleImage.src = allImage.snowSrc;
	container = particle = camera = scene = renderer = null;
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	particles = [];
	isOpen = true;
	container = box;
	camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();
	scene.add(camera);
		
	renderer = new THREE.CanvasRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );
		
	for (var i = 0; i < 120; i++) {

		particle = new Particle3D( material);
		particle.position.x = Math.random() * 2000 - 1000;
		particle.position.y = Math.random() * 2000 - 1000;
		particle.position.z = Math.random() * 2000 - 1000;
		particle.scale.x = particle.scale.y =  1;
		scene.add( particle );
		
		particles.push(particle); 
	}
	container.appendChild(renderer.domElement);	
	ani();
	this.close = function(){
		particles = [];
		container.removeChild( renderer.domElement );
		isOpen = false;		
	}
}

var ani = function(){
	loop();
	if(isOpen)
		requestAnimationFrame(ani);
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

//

function loop() {

for(var i = 0; i<particles.length; i++)
	{

		var particle = particles[i]; 
		particle.updatePhysics(); 

		with(particle.position)
		{
			if(y<-1000) y+=2000; 
			if(x>1000) x-=2000; 
			else if(x<-1000) x+=2000; 
			if(z>1000) z-=2000; 
			else if(z<-1000) z+=2000; 
		}				
	}

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt(scene.position); 

	renderer.render( scene, camera );
	
}

bgCanvas.list.push(mySnow);
	
})();

//五星
(function(){
	
function rand(min, max) {
	return Math.random() * (max - min) + min;
}
var getRandom = function(begin,end){
	return parseInt(Math.random()*((end>begin?end-begin:begin-end)+1)+(end>begin?begin:end));	
}
function getRandomColor(){ 
	return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
} 
function genStar() {
	var size = rand(minSize, maxSize),
		rot = (rand(0, 1) > .5 ? -1 : 1) * rand(minRot, maxRot),
		delay = rand(minDelay, maxDelay),
		x = rand(0, w),
		y = rand(0, h),
		s = rand(minSpeed, maxSpeed),
		dir = rand(0, Math.PI * 2),
		vx = Math.cos(dir) * s,
		vy = Math.sin(dir) * s,
		pii = getRandom(50,100)+'%';
		//color = 'hsla(hue, 80%, 50%, alp)'.replace('hue', frame % 360);
		//color = 'hsla(hue, 80%, '+pi+', alp)'.replace('hue', getRandom(0,360));
		color = 'hsla(hue, 80%, diaosi, alp)'.replace('hue', frame % 360).replace('diaosi', pii);
	for (var i = 0; i < 5; ++i) {
		vertices.push(new Vertex(size, rot, dir + radSlice * i, delay * i,
			  x + Math.cos(radSlice * i) * size,
			  y + Math.sin(radSlice * i) * size,
							 vx, vy, x, y, color))
	}
}
function Vertex(size, rot, dir, delay, x, y, vx, vy, ox, oy, color) {
	this.size = size;
	this.rotSpeed = rot;
	this.rot = dir;
	this.delay = absoluteDelay + delay;
	this.life = 0;
	this.ox = ox;
	this.oy = oy;
	this.x;
	this.y;
	this.vx = vx;
	this.vy = vy;
	this.color = color;
}
Vertex.prototype.use = function () {
	++this.life;
	if (this.life >= this.delay) {
		this.x += Math.cos(this.rot) * 3
		this.y += Math.sin(this.rot) * 3;

	} else {
		if (this.life <= absoluteDelay) {
			this.rot += this.rotSpeed;
			this.ox += this.vx;
			this.oy += this.vy;
		}
		this.x = this.ox + Math.cos(this.rot) * this.size;
		this.y = this.oy + Math.sin(this.rot) * this.size;
	}

	var alpha = Math.min(this.life, absoluteDelay) / absoluteDelay;
	if (this.life > 100) alpha = (200 - this.life) / 100;

	ctx.lineWidth = this.size / 3;
	ctx.strokeStyle = this.color.replace('alp', alpha);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.rot);
	ctx.beginPath();
	ctx.moveTo(-this.size / 3, -this.size / 2);
	ctx.lineTo(this.size, 0);
	ctx.lineTo(-this.size / 3, this.size / 2);
	ctx.stroke();
	ctx.rotate(-this.rot);
	ctx.translate(-this.x, -this.y);
}

function anim(){
	if(isOpen)
		window.requestAnimationFrame(anim);

	++frame;
	
	ctx.clearRect(0,0,window.innerWidth,window.innerHeight);	

	if (Math.random() < spawnProb) genStar();

	for (var i = 0; i < vertices.length; ++i) {
		var vert = vertices[i];
		vert.use();

		if (vert.x < 0 || vert.x > w ||
		   vert.y < 0 || vert.y > h ||
			vert.life > 200) {
			vertices.splice(i, 1);
			--i;
		}
	}
}

    var w,h,ctx,isOpen = false;
    var spawnProb = 0.02,
    absoluteDelay = 50,
    minSize = 5,
    maxSize = 10,
    minRot = .01,
    maxRot = .1,
    minDelay = 3,
    maxDelay = 5,
    minSpeed = 1,
    maxSpeed = 5,

    radSlice = Math.PI * 2 / 5,
    frame = 0,
    vertices = [];
	
var myStars = function(box){
	var box = box;
	var c = document.createElement('canvas');
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
	box.appendChild(c);
    ctx = c.getContext('2d');
	if(window.innerWidth>500&&window.innerHeight>350)
		minSpeed = 5,maxSpeed = 10;
	else
		maxSpeed = 5;
	isOpen = true;
	anim();
    this.close = function(){
		isOpen = false;
		box.removeChild(c);
		vertices = [];
		$(window).unbind('stars.resize');	
	}
	$(window).bind('stars.resize',function(){
		if(window.innerWidth>500&&window.innerHeight>350)
			minSpeed = 5,maxSpeed = 10;
		else
			maxSpeed = 5;
	   	w = c.width = window.innerWidth;
    	h = c.height = window.innerHeight;
		ctx.clearRect(0,0,window.innerWidth,window.innerHeight);	
	})	
}

bgCanvas.list.push(myStars);
	
})();

//圆点
(function(){
var canvas;
var context;
var maxDot = 40;

function Dot() {
	this.alive = true;
	this.x = Math.round(Math.random() * canvas.width);
	this.y = Math.round(Math.random() * canvas.height);
	this.diameter = Math.random() * 7;
	this.colorIndex = Math.round(Math.random() * 3);
	this.colorArray = ['rgba(255,64,0,', 'rgba(66,66,66,', 'rgba(188,188,188,', 'rgba(50,153,187,'];
	this.alpha = 0.1;
	this.color = this.colorArray[this.colorIndex] + this.alpha + ')';

	this.velocity = { x: Math.round(Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7, y: Math.round(Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7 };
}

Dot.prototype = {
	Draw: function () {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.diameter, 0, Math.PI * 2, false);
		context.fill();
	},

	Update: function () {
		if (this.alpha < 0.8) {
			//console.log(this.color);
			this.alpha += 0.01;
			this.color = this.colorArray[this.colorIndex] + this.alpha + ')';
			//console.log('===' + this.color);
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.x > canvas.width + 5 || this.x < 0 - 5 || this.y > canvas.height + 5 || this.y < 0 - 5) {
			this.alive = false;
		}
	}
};

var EntityArray = [];

var isOpen = false;

var myDot = function(box){
	var box = box;
	canvas = document.createElement('canvas');
    canvas.width = window.innerWidth,
    canvas.height = window.innerHeight,
	context = canvas.getContext('2d');
	box.appendChild(canvas);
	$(window).bind('dot.resize',function(){
		EntityArray = [];
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;		
	})
	isOpen = true;
	for (var x = 0; x < maxDot; x++) {
		EntityArray.push(new Dot());
	}
	Update();
	
	this.close = function(){
		$(window).unbind('dot.resize');
		box.removeChild(canvas);
		EntityArray = [];
		isOpen = false;	
	}
}

function Update() {
	if (EntityArray.length < maxDot) {
		for (var x = EntityArray.length; x < maxDot; x++) {
			EntityArray.push(new Dot());
		}
	}

	EntityArray.forEach(function (dot) {
		dot.Update();
	});

	EntityArray = EntityArray.filter(function (dot) {
		return dot.alive;
	});

	Draw();
	if(isOpen)
		requestAnimationFrame(Update);
}

function Draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	EntityArray.forEach(function (dot) {
		dot.Draw();
	});
}

bgCanvas.list.push(myDot);

})();