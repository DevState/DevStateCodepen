
//=========================::UNIT ANIMATOR::===============================

//animates a number from 0-1 (with optional easing) for a given duration and a framerate
//this is used to animate or tweeen visuals which are set up using interpolation

(function (window){

    window.requestAnimationFrame =
        window.__requestAnimationFrame ||
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            (function () {
                return function (callback, element) {
                    var lastTime = element.__lastTime;
                    if (lastTime === undefined) {
                        lastTime = 0;
                    }
                    var currTime = Date.now();
                    var timeToCall = Math.max(1, 33 - (currTime - lastTime));
                    window.setTimeout(callback, timeToCall);
                    element.__lastTime = currTime + timeToCall;
                };
            })();
    
	//constructor, duration and framerate must be in milliseconds
	var UnitAnimator = function(duration, canvas, updateCallBack, completeCallBack){
        this.easingFunction = UnitAnimator.easeLinear;//default
        this.animating = false;
        var scope = this;
        this.loopFunction = function(){scope.loop();};
		this.reset(duration, canvas, updateCallBack, completeCallBack);

	};

	//t is "time" this.millisecondsAnimated
	//b is the "beginning" value
	//c is "change" or the difference of end-start value
	//d is this.duration
	
	//classic Robert Penner easing functions
	//http://www.robertpenner.com/easing/
	
	
	UnitAnimator.easeLinear = function(t, b, c, d){
		return c * (t / d) + b;
	};
	
	//SINE
	UnitAnimator.easeInSine = function (t, b, c, d){
		return -c * Math.cos(t/d * MathUtil.HALF_PI) + c + b;
	};
	UnitAnimator.easeOutSine = function (t, b, c, d){
		return c * Math.sin(t/d * MathUtil.HALF_PI) + b;
	};
	UnitAnimator.easeInOutSine = function (t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	};
	
	
	//BOUNCE
	UnitAnimator.easeInBounce = function(t, b, c, d){
		return c - UnitAnimator.easeOutBounce (d-t, 0, c, d) + b;
	};
	UnitAnimator.easeOutBounce = function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	};
	UnitAnimator.easeInOutBounce = function (t, b, c, d){
		if (t < d/2){
			return UnitAnimator.easeInBounce (t*2, 0, c, d) * .5 + b;
		}
		return UnitAnimator.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	};
	
	//ELASTIC
	UnitAnimator.easeInElastic = function(t, b, c, d, a, p){
		var s;
		if (t==0){
			return b; 
		}
		if ((t/=d)==1){
			return b+c;
		}
		if (!p){
			p=d*.3;
		}
		if (!a || a < Math.abs(c)) {
			a=c; s=p/4; 
		}else{
			s = p/MathUtil.PI2 * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*MathUtil.PI2/p )) + b;
	};
	UnitAnimator.easeOutElastic = function(t, b, c, d, a, p){
		var s;
		if (t==0){
			return b;
		}
		if ((t/=d)==1){
			return b+c;
		}
		if (!p){
			p=d*.3;
		}
		if (!a || a < Math.abs(c)) {
			a=c; s=p/4; 
		}else{
			s = p/MathUtil.PI2 * Math.asin (c/a);
		}
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*MathUtil.PI2/p ) + c + b);
	};
	UnitAnimator.easeInOutElastic = function(t, b, c, d, a, p){
		var s;
		if (t==0){
			return b;
		}
		if ((t/=d/2)==2){
			return b+c;
		}
		if (!p){
			p=d*(.3*1.5);
		}
		if (!a || a < Math.abs(c)) {
			a=c; s=p/4; 
		}else{
			s = p/MathUtil.PI2 * Math.asin (c/a);
		}
		if (t < 1){
			return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*MathUtil.PI2/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*MathUtil.PI2/p )*.5 + c + b;
	};
	
	UnitAnimator.easingFunctions = [UnitAnimator.easeLinear,
                                    UnitAnimator.easeInSine, UnitAnimator.easeOutSine, UnitAnimator.easeInOutSine,
                                    UnitAnimator.easeInBounce, UnitAnimator.easeOutBounce, UnitAnimator.easeInOutBounce,
                                    UnitAnimator.easeInElastic, UnitAnimator.easeOutElastic, UnitAnimator.easeInOutElastic
                                    ];
	
	UnitAnimator.getRandomEasingFunction = function(){
		return UnitAnimator.easingFunctions[Math.floor( Math.random()*UnitAnimator.easingFunctions.length )];
	};
	
	UnitAnimator.prototype.setRandomEasingFunction = function(){
		this.easingFunction = UnitAnimator.getRandomEasingFunction();
	};
	
	UnitAnimator.prototype.setEasingFunction = function(easingFunction){
		if(UnitAnimator.easingFunctions.indexOf(easingFunction) > -1){
			this.easingFunction = easingFunction;
		}
	};
	
	//easing (t, b, c, d)
	//@t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever � as long as the unit is the same as is used for the total time [3].
	//@b is the beginning value of the property.
	//@c is the change between the beginning and destination value of the property.
	//@d is the total time of the tween.
	UnitAnimator.prototype.getAnimationPercent = function(){
		return this.easingFunction(MathUtil.normalize(this.millisecondsAnimated, 0, this.duration), 0, 1, 1);
	};

    UnitAnimator.prototype.reset = function(duration, canvas, updateCallBack, completeCallBack){
        this.duration = duration;
        this.canvas = canvas;
        this.updateCallBack = updateCallBack;
        this.completeCallBack = completeCallBack;
    };
	
	UnitAnimator.prototype.start = function(easingFunction){
		//console.log("UnitAnimator.start()");
		if(easingFunction){
			this.setEasingFunction(easingFunction);
		}
        this.animating = true;
        this.animationStart = Date.now();
        this.millisecondsAnimated = 0;//keeps track of how long the animation has been running
		this.loop();
	};

    UnitAnimator.prototype.loop = function(){
        if(!this.animating){
            return;
        }
        this.update();
        window.requestAnimationFrame(this.loopFunction, canvas);
    }

	UnitAnimator.prototype.pause = function(){
		this.animating = false;
	};

    UnitAnimator.prototype.stop = function(){
        this.pause();
    };

	//refactor, make private
	UnitAnimator.prototype.update = function(){
		//console.log("UnitAnimator.update()",this.getAnimationPercent());
		this.millisecondsAnimated = Date.now() - this.animationStart;
		if(this.millisecondsAnimated >= this.duration){
			//console.log("UnitAnimator.update() animation complete");
			this.pause();
			this.millisecondsAnimated = this.duration;
			this.dispatchUpdate();
			this.dispatchComplete();
			return;
		}
		this.dispatchUpdate();
	};
	
	UnitAnimator.prototype.dispatchUpdate = function(){
		if(this.updateCallBack){
			//console.log("UnitAnimator.dispatchUpdate()",this.getAnimationPercent());
			this.updateCallBack();
		}
	};
	UnitAnimator.prototype.dispatchComplete = function(){
		if(this.completeCallBack){
			this.completeCallBack();
		}
	};

    window.UnitAnimator = UnitAnimator;
	
}(window));