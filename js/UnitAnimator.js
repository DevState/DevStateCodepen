
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
	
	UnitAnimator.easingFunctions = [UnitAnimator.easeLinear,
                                    UnitAnimator.easeInSine, UnitAnimator.easeOutSine, UnitAnimator.easeInOutSine];
	
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