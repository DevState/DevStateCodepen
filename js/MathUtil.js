(function (window){

    var MathUtil = {};


	
	//used for radiansToDegrees and degreesToRadians
	MathUtil.PI_180 = Math.PI/180;
	MathUtil.ONE80_PI = 180/Math.PI;
	
	//precalculations for values of 90, 270 and 360 in radians
	MathUtil.PI2 = Math.PI*2;
	MathUtil.HALF_PI = Math.PI/2;
	MathUtil.PI_AND_HALF = Math.PI+ Math.PI/2;
	MathUtil.NEGATIVE_HALF_PI = -Math.PI/2;

    //keep degrees between 0 and 360
    MathUtil.constrainDegreeTo360 = function(degree){
        return (360 + degree % 360) % 360;//hmmm... looks a bit weird?!
    };

    MathUtil.constrainRadianTo2PI = function(rad){
        return (MathUtil.PI2 + rad % MathUtil.PI2) % MathUtil.PI2;//equally so...
    };

    MathUtil.radiansToDegrees = function(rad){
        return rad*MathUtil.ONE80_PI;
    };

    MathUtil.degreesToRadians = function(degree){
        return degree * MathUtil.PI_180;
    };

	//return number between 1 and 0
	MathUtil.normalize = function(value, minimum, maximum){
		return (value - minimum) / (maximum - minimum);
	};

	//map normalized number to values
	MathUtil.interpolate = function(normValue, minimum, maximum){
		return minimum + (maximum - minimum) * normValue;
	};

	//map a value from one set to another
	MathUtil.map = function(value, min1, max1, min2, max2){
		return MathUtil.interpolate( MathUtil.normalize(value, min1, max1), min2, max2);
	};




    MathUtil.clamp = function(min,max,value){
        if(value < min){
            return min;
        }
        if(value > max){
            return max;
        }
        return value;
    };

    MathUtil.clampRGB = function(value){
        return MathUtil.clamp(0, 255, Math.round(value));
    };

	MathUtil.getRandomNumberInRange = function(min, max){
		return min + Math.random() * (max - min);
	};

    //from : http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    MathUtil.getRandomHexColorString = function() {
        return MathUtil.rgbToHex(Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255));
    }

    //from : http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    MathUtil.rgbToHex = function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    MathUtil.hexToRgb = function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    window.MathUtil = MathUtil;
	
}(window));