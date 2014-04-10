//has a dependency on MathUtil

(function (window){

    var Geom = {};

    //==================================================
    //=====================::POINT::====================
    //==================================================

    Geom.Point = function (x,y){
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
    };

    Geom.Point.prototype.clone = function(){
        return new Geom.Point(this.x,this.y);
    };

    Geom.Point.prototype.update = function(x, y){
        this.x = isNaN(x) ? this.x : x;
        this.y = isNaN(y) ? this.y : y;
    };

    Geom.Point.prototype.add = function(x, y){
        this.x += isNaN(x) ? 0 : x;
        this.y += isNaN(y) ? 0 : y;
    };

    Geom.Point.prototype.equals = function(point){
        return this.x==point.x && this.y==point.y;
    };

    Geom.Point.prototype.toString = function(){
        return "{x:"+this.x+" , y:"+this.y+"}";
    };

    Geom.Point.interpolate = function(pointA, pointB, normal){
        return new Geom.Point(Sakri.MathUtil.interpolate(normal, pointA.x, pointB.x) , Sakri.MathUtil.interpolate(normal, pointA.y, pointB.y));
    };

    Geom.Point.distanceBetweenTwoPoints = function( point1, point2 ){
        //console.log("Math.pow(point2.x - point1.x,2) : ",Math.pow(point2.x - point1.x,2));
        return Math.sqrt( Math.pow(point2.x - point1.x,2) + Math.pow(point2.y - point1.y,2) );
    };

    Geom.Point.angleBetweenTwoPoints = function(p1,p2){
        return Math.atan2(p1.y-p2.y, p1.x-p2.x);
    };

	//==================================================
	//===================::RECTANGLE::==================
	//==================================================

	Geom.Rectangle = function (x, y, width, height){
		this.update(x, y, width, height);
	};
	
	Geom.Rectangle.prototype.update = function(x, y, width, height){
		this.x = isNaN(x) ? 0 : x;
		this.y = isNaN(y) ? 0 : y;
		this.width = isNaN(width) ? 0 : width;
		this.height = isNaN(height) ? 0 : height;
	};
	
	Geom.Rectangle.prototype.updateToRect = function(rect){
		this.x = rect.x;
		this.y = rect.y;
		this.width = rect.width;
		this.height = rect.height;
	};
	
	Geom.Rectangle.prototype.scaleX = function(scaleBy){
		this.width *= scaleBy;
	};
	
	Geom.Rectangle.prototype.scaleY = function(scaleBy){
		this.height *= scaleBy;
	};
	
	Geom.Rectangle.prototype.scale = function(scaleBy){
		this.scaleX(scaleBy);
		this.scaleY(scaleBy);
	};

	Geom.Rectangle.prototype.getRight = function(){
		return this.x + this.width;
	};
	
	Geom.Rectangle.prototype.getBottom = function(){
		return this.y + this.height;
	};

    Geom.Rectangle.prototype.getCenter = function(){
        return new Geom.Point(this.getCenterX(), this.getCenterY());
    };

    Geom.Rectangle.prototype.getCenterX = function(){
        return this.x + this.width/2;
    };

    Geom.Rectangle.prototype.getCenterY=function(){
        return this.y + this.height/2;
    };

    Geom.Rectangle.prototype.containsPoint = function(x, y){
        return x >= this.x && y >= this.y && x <= this.getRight() && y <= this.getBottom();
    };
    Geom.Rectangle.prototype.containsRect = function(rect){
        return this.containsPoint(rect.x, rect.y) && this.containsPoint(rect.getRight(), rect.getBottom());
    };
	

	Geom.Rectangle.prototype.clone = function(){
		return new Geom.Rectangle(this.x, this.y, this.width, this.height);
	};
	
	Geom.Rectangle.prototype.toString = function(){
		return "Rectangle{x:"+this.x+" , y:"+this.y+" , width:"+this.width+" , height:"+this.height+"}";
	};


    //==================================================
    //=====================::Point3d::====================
    //==================================================


    Geom.Point3d = function (x,y, z){
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
        this.z = isNaN(z) ? 0 : z;
    };

    Geom.Point3d.prototype.clone = function(){
        return new Geom.Point3d(this.x, this.y, this.z);
    };

    Geom.Point3d.prototype.copyValuesTo = function(point3d){
        point3d.x = this.x;
        point3d.y = this.y;
        point3d.z = this.z;
    };

    Geom.Point3d.prototype.updateValues = function(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    };

    Geom.Point3d.prototype.equals = function(point){
        return this.x==point.x && this.y==point.y && this.z==point.z;
    };


    Geom.Point3d.prototype.toString = function(){
        return "{x:"+this.x+" , y:"+this.y+" , z:"+this.z+"}";
    };
    
    
    

    window.Geom = Geom;
    
}(window));