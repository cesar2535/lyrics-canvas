window.requestNextAnimationFrame =  (function() {
	 if (window.requestAnimationFrame)  // Padrão W3C
	    return window.requestAnimationFrame;	
	 if (window.webkitRequestAnimationFrame)  // Chrome e Safari
	    return window.webkitRequestAnimationFrame;	
	 if (window.mozRequestAnimationFrame)  // Mozilla
	    return window.mozRequestAnimationFrame;	
	 if (window.msRequestAnimationFrame)  // IE 9+
	    return window.msRequestAnimationFrame;	
	return function (callback, element) {  // O navegador não suporta
		var self = this, start, finish;			
		window.setTimeout(function() {
			  start = +new Date();
			  callback(start);
			  finish = +new Date();
			  self.timeout = 1000 / 60 - (finish - start);
		}, self.timeout);
	};
})();


function Drawable(backImagePath, width, height, parent){
	this.parent = parent;
	this.width = width;
	this.height = height;
	this.isReady = true;		
	this.backImage = null;

	// if(backImagePath){
	// 	this.backImage = new Image();
	// 	this.backImage.src = backImagePath;
	// 	this.backImage.onload = function () {
	// 		this.isReady = true;
	// 	};
	// }
	this.drawText = function(ctx){
		ctx.fillStyle = "rgb(250, 000, 000)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText(text, 32, 32);
	};
	
	Drawable.prototype.init = function(){
	
	};
	Drawable.prototype.draw = function(ctx){	
		if(this.isReady){
			if(!this.position){
				// ctx.drawImage(this.backImage, 0, 0);
			}else{
				// ctx.drawImage(this.backImage, this.position.x, this.position.y);	
				ctx.fillStyle = this.color;
				ctx.font = this.size + "px " + this.font;
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.fillText(this.text, canvas.width / 2, this.position.y);		
			}
		}
	};
}
//----------------------------------
function Scene(canvas, backImagePath){	
	Drawable.call(this, backImagePath);
	var drawableObjects = [];	
	this.canvas = canvas;
	this.draw = function(ctx){		
		ctx.clearRect(0, 0, canvas.width, canvas.height);		
		Drawable.prototype.draw.call(this, ctx);
		for(var i = 0; i < drawableObjects.length; i++){
			drawableObjects[i].draw(ctx);
		}	
		//console.log(drawableObjects[1].position)	
		// // Are they touching?
			
	};	
	
	
	this.init = function(){
		Drawable.prototype.init.call(this);
		for(var i = 0; i < drawableObjects.length; i++){
			drawableObjects[i].init();
		}
			
	};
	this.start = function(){
	};
	this.pause = function(){
	};
	this.reset = function(){
	};	
	this.stop = function(){

	};	
	this.addDrawableObject = function(drawable){
		drawable.parent = this;
		drawableObjects.push(drawable);
	};	
	this.removeDrawableObject = function(drawable){
		//TODO
	};	
}
Scene.prototype = Object.create(Drawable.prototype);

function TextNode(config){	
	Drawable.call(this);
	this.text = config.text   || "Não Encontrado";
	this.font = config.font   || "Arial";
	this.size = config.size   || 60;
	this.color = config.color || '#000000';	
	px = config.px || 10;
	py = config.py || 10;
	this.init = function(){
		Drawable.prototype.init.call(this);
	};
	this.draw = function(ctx){		
		Drawable.prototype.draw.call(this, ctx);
	};		
	this.position = {x:px,y:py };
}
TextNode.prototype = Object.create(Drawable.prototype);




function Timeline(tempo){
            
            this.keyframes = [];
            this.time = tempo;
            this.interval = '';
            var that = this;

          	this.addKeyframe = function(tempo,callback){
                this.keyframes.push({time: tempo, fn: callback, ex:false});
            }
         
            this.start = function(){
                for (x in this.keyframes) {
                    setTimeout(this.keyframes[x].fn,this.keyframes[x].time);
                }

            }
            this.stop = function(){
                clearInterval(this.interval);
                console.log("Timeline parada.");
            }

}

function Musica(){
	Timeline.call(this);
	mp3 = document.getElementById("mp3Music");
	that = this;
	this.start = function(){
		setInterval(function(){
			var tempo = Math.round(mp3.currentTime*1000)
			$(that.keyframes).each(function(key,data){
				if(tempo >= data.time && !data.ex){
					data.fn();
					data.ex = true;
					console.log(data.time, tempo);
				}

			})
		},1)
   
		mp3.play();

    }
		// timeline.start(0)
}
Musica.prototype = Object.create(Timeline.prototype);


function getJson(url){
	var musica = new Musica("httl")
	
	canvas = document.getElementById("dcanvas");
	ctx = canvas.getContext("2d");
	
	$.getJSON(url,function(data){
		var mus = new Musica();
		

		$(data.lirics).each(function(key,dt){

			fn = function(){
				var scene = new Scene(canvas);
				scene.addDrawableObject(new TextNode({
					text:dt.line,
					px:100,
					py:300,
					font: "sans-serif"
				}))
			
				window.requestNextAnimationFrame(function(){
				scene.draw(ctx);
				});
				scene.init();
			}
			mus.addKeyframe(dt.delay,fn);


		})
			mus.start();
		console.log('mus');
	})

	
}
window.onload = function(){

	getJson('assets/musics/100-suns.json');
	
};