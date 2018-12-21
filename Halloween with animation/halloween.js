/*
BONUS:

1.press 'b' or 'B' to reset scene
2.make the ghost fly around

*/



var modelViewMatrix=mat4(); // identity
var ghostMatrix= mat4();
var bowMatrix= mat4();
var arrowMatrix= mat4();

var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];
var colors=[];

var cmtStack=[];

var randX= [];
var randY= [];
var STEPS= 100;


var ghost= false;

var SIZE=200;   // number of locations to fly to before stopping

var count=0;    // counting the number of location it is currently at
var ghostStepCount=0;  // count the steps from 0 to 99 between each pair of locations
var prevPosition=[];
var nextPosition=[];

var fire= false;
var bowAngle=0;

function main() 
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();
    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    for (var i=0; i<40; i++)
    {
            randX[i]=Math.random()*(8- (-8)) + (-8);
            randY[i]=Math.random()*(8-3.6) + 3.6;
    }
    
   window.onkeydown =  function(event)
    {
         var key=String.fromCharCode(event.keyCode);
 
        if ((key == 'S') || (key == 's'))
        {
                ghost = !ghost;
                prevPosition = [(Math.random()*(8- (-8)) + (-8)), (Math.random()*(8- 0) + (0))];
                nextPosition= [(Math.random()*(8- (-8)) + (-8)), (Math.random()*(8- 0) + (0))];
 
                ghostMatrix= mult(ghostMatrix, translate(prevPosition[0], nextPosition[1], 0));

         
        }
        else if ((key == 'L') || (key == 'l'))
        {
                bowAngle += 3;
        }
        else if ((key== 'R') || (key == 'r'))
        {
                bowAngle -=3;
        }
        
        else if ((key == 'F') || (key == 'f'))
        {
                fire = true;
                 
        }
        else if ((key == 'B') || (key == 'b'))
        {
                bowAngle=0;
                fire = false;
                ghost= false;
                 
        }
        
 
    };

    initWebGL();

    render();
}

function initWebGL() 
{
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

function scale4(a, b, c) 
{
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

/*---------------------------------------
       
         GENERATE SHAPES FUNCTIONS

-----------------------------------------*/

function GeneratePoints()
{
       
    	GeneratePlanet();
        GenerateGhost();
        GenerateSkyAndGround();
        GenerateMountains();
        GenerateArrow();
        GenerateStars(); 
        GenerateBow();  
        GenerateRings(); 
      
}

function GenerateSkyAndGround()
{
        // sky
        points.push(vec2(-8,8));
        colors.push(vec4(0.19,0.19,0.30,1));
        points.push(vec2(-8,0));
        colors.push(vec4(0.9,0.05,0.7,1));
        points.push(vec2(8,0));
        colors.push(vec4(0.9,0.05,0.7,1));
        points.push(vec2(8,8));
        colors.push(vec4(0.19,0.19,0.30,1));
        // floor
        points.push(vec2(-8,0.5));
        colors.push(vec4(0.23,0.15,0, 1));
        points.push(vec2(8,0.5));
        colors.push(vec4(0, 0.1, 0.05, 1));
        points.push(vec2(8,-8));
        colors.push(vec4(0, 0.2, 0.1, 1));
        points.push(vec2(-8,-8));
        colors.push(vec4(0, 0.4, 0.05, 1));
      
}

function GeneratePlanet() 
{
	var Radius=1.0;
	var numPoints = 80;
	
	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
		var Y = Math.sin( Angle )*Radius; 
	        colors.push(vec4(0.7, 0.7, 0, 1)); 
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function GenerateRings()
{
        var SLICES= 100;
        var angle= 2*Math.PI/SLICES;
        var radius;
        var radii= [1.2, 1.4, 1.6, 1.8];

        for (var i=0; i<4; i++)
        {
                radius= radii[i];
                for(var j=0; j< (SLICES/2)+1; j++ )
                {
                        points.push(vec2(radius*Math.cos(j*angle), radius*Math.sin(j*angle)));

                        if (i == 0)
                                colors.push(vec4(1,0,0,1));
                        else if (i== 1)
                                colors.push(vec4(0,1,0,1));
                        else if (i == 2)
                                colors.push(vec4(0,0,1,1));
                        else if (i == 3)
                                colors.push(vec4(1,0,1,1)); 
                }
        }
                
}

function GenerateStars()
{
        var center= vec2(0.0, 0.0);
        var radius = 0.4;    // radius of the circle
        var Radius = .6;
        var angle = 2*Math.PI/5;
       // points.push(vec2(center[0], center[1]));
    
        for (var i=0; i<5; i++) {
                // point from outer circle
                points.push(vec2(radius*Math.cos(i*angle), radius*Math.sin(i*angle)));
                colors.push(vec4(0.7, 0.7, 0, 1)); 
                // point from outer circle
                points.push(vec2(Radius*Math.cos((i*angle)+Math.PI/5), Radius*Math.sin((i*angle)+Math.PI/5)));
                colors.push(vec4(0.7, 0.7, 0, 1)); 
        }
}

function GenerateGhost() 
{
        // begin body  (87 points)
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.1, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 3.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.1, 3.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(5.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6,3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.7, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.8, 2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7, 2.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8.5, 1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9, 1.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 0.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.4, -2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.5, -3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.7, -1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, -1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11.2, -1.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.8, -0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, 0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.8, 1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.2, 2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9.8, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 9.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(.5, 15));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, 17));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.8, 17.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 16.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, 10.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, 10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 8.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12.5, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13.5, -1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, -2.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, 1.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6.5, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4.5, 6.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.2, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, -5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-7, -8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, -10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, -14.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, -15.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11, -17.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, -11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(1, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, -7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, -3.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
        // end body

	// begin mouth (6 points)
	points.push(vec2(-1, 6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.2, 8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 8.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.5, 5.8));
        colors.push(vec4(1, 1, 1, 1));
        // end mouth

	// begin nose (5 points)
	points.push(vec2(-1.8, 9.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 9.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.1, 10.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.6, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.9, 10));
        colors.push(vec4(1, 1, 1, 1));

        // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
        // outer eye, draw line loop (9 points)
        points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.5, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));

        // eye ball, draw triangle_fan (7 points)
        points.push(vec2(-2.5, 11.4));  // middle point
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));
        // end left eye
}

function GenerateMountains()
{
        //generate first mountain
        points.push(vec2(2.6,-2.3));
        colors.push(vec4(0.23,0.15,0, 1)); // right
        points.push(vec2(5.7,-2.3));
        colors.push(vec4(0.0,0.2,0, 1)); // left
        points.push(vec2(4,3));
        colors.push(vec4(.23,0.15,0, 1)); // top

        // second mountains
        points.push(vec2(5.8,2));
        colors.push(vec4(.5, 0, 0, 1));
        points.push(vec2(9.2,-1.4));
        colors.push(vec4(.2, 0, 0, 1));
        points.push(vec2(4.5,-1.4));
        colors.push(vec4(.5, 0, 0, 1));

        //third mountain
        points.push(vec2(10.1,2));
        colors.push(vec4(0.6,0,0, 1));
        points.push(vec2(9.15,-1.4));
        colors.push(vec4(0.17,0,0, 1));
        points.push(vec2(7.6,0.15));
        colors.push(vec4(0.17,0,0, 1));


}

function GenerateArrow()
{
        //long line
        points.push(vec2(0,2));
        colors.push(vec4(0,0,0.7,1));
        points.push(vec2(0,-9));
        colors.push(vec4(0,0,0.7,1));

        // \
        points.push(vec2(0,2));
        colors.push(vec4(0,0,0.7,1));
        points.push(vec2(1,1));
        colors.push(vec4(0,0,0.7,1));

        // \
        points.push(vec2(0,2));
        colors.push(vec4(0,0,0.7,1));
        points.push(vec2(-1,1));
        colors.push(vec4(0,0,0.7,1));
}

function GenerateBow()
{
        var Radius=1;
	var numPoints = 40;
	
	
        for( var i=0; i<numPoints+4; i++ ) 
        {
		var Angle = i * (1*Math.PI/numPoints); 
		var X = Math.cos( Angle )*Radius; 
                var Y = Math.sin( Angle )*Radius; 
                colors.push(vec4(1, 0.52, 0, 1)); 
                points.push(vec2(X, Y));  
        } 

       /* draw the rest of the arc
        points.push(vec2(-1,0.2));
        colors.push(vec4(1, 0.52, 0, 1));

        points.push(vec2(-1,-.5));
        colors.push(vec4(1, 0.52, 0, 1)); 

        points.push(vec2(-1,-.5));
        colors.push(vec4(1, 0.52, 0, 1)); 
        
        points.push(vec2(-2,-.5));
        colors.push(vec4(1, 0.52, 0, 1)); */

        


        // draw bow string

        points.push(vec2(-1,-.3));
         colors.push(vec4(1, 1, 1, 1));

        points.push(vec2(0,-1.5));
        colors.push(vec4(1, 1, 1, 1));

        points.push(vec2(1,-.2));
        colors.push(vec4(1, 1, 1, 1));
        
        points.push(vec2(0,-1.5));
        colors.push(vec4(1, 1, 1, 1)); 
       
}


/*---------------------------------------
       
        DRAW FUNCTIONS

-----------------------------------------*/
function DrawSkyAndGround()
{
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // Draw sky
        gl.drawArrays(gl.TRIANGLE_FAN, 194,4);  
        // draw ground
        gl.drawArrays(gl.TRIANGLE_FAN, 198,4);

}

function DrawFullPlanet() 
{
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-5, 6.6, 1));
	modelViewMatrix=mult(modelViewMatrix, scale4(2/3, 2*1.618/3, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);
}

function DrawRingBack()
{ 
      
        modelViewMatrix= mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(-5, 6.6, 1));
        modelViewMatrix= mult(modelViewMatrix, rotate(45,0,0,1));
       

        modelViewMatrix= mult(modelViewMatrix, scale4(0.7,0.7,1));
        modelViewMatrix= mult(modelViewMatrix, scale4(1.5,0.45,1));
       
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.LINE_STRIP, 276,50);
        gl.drawArrays( gl.LINE_STRIP, 326,50);
        gl.drawArrays( gl.LINE_STRIP, 377,50);
        gl.drawArrays( gl.LINE_STRIP, 428,50);

       // console.log(modelViewMatrix);

      
}

function DrawRingFront()
{
      
        modelViewMatrix= mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(-5, 6.6, 1));
        modelViewMatrix= mult(modelViewMatrix, rotate(225,0,0,1));
        modelViewMatrix= mult(modelViewMatrix, scale4(0.7,0.7,1));
        modelViewMatrix= mult(modelViewMatrix, scale4(1.5,0.45,1));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
        gl.drawArrays( gl.LINE_STRIP, 276,50);
        gl.drawArrays( gl.LINE_STRIP, 326,50);
        gl.drawArrays( gl.LINE_STRIP, 377,50);
        gl.drawArrays( gl.LINE_STRIP, 428,50);

}

function DrawStars()
{         

        for(var i=0; i<40; i++)
        {
                modelViewMatrix=mat4();
                modelViewMatrix = mult(modelViewMatrix, translate(randX[i], randY[i], 1));
                modelViewMatrix=mult(modelViewMatrix, scale4(1,1, 1));
                modelViewMatrix=mult(modelViewMatrix, scale4(1/6,1/6, 1));
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.drawArrays( gl.TRIANGLE_FAN, 217,10);
              
        }
}  

function DrawGhost() 
{
    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 167, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 173, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 178, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 178, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // right eye ball
}

function DrawMountains()
{
        
        gl.drawArrays(gl.TRIANGLE_FAN, 205,3);
        gl.drawArrays(gl.TRIANGLE_FAN, 202,3);
        gl.drawArrays(gl.TRIANGLE_FAN, 208,3);
        modelViewMatrix=mat4();
	
       
        modelViewMatrix = mult(modelViewMatrix, translate(-11.7,1, 1));
	modelViewMatrix=mult(modelViewMatrix, scale4(1.2,1.2, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLE_FAN, 205,3);
        gl.drawArrays(gl.TRIANGLE_FAN, 202,3);
        gl.drawArrays(gl.TRIANGLE_FAN, 208,3);

}

function DrawArrow()
{
       modelViewStack.push (modelViewMatrix);
       
       modelViewMatrix=mult(modelViewMatrix, scale4(0.2,0.2, 1));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
       
        gl.drawArrays( gl.LINE_STRIP, 211,2);

        gl.drawArrays( gl.LINE_STRIP, 213,2);

        gl.drawArrays( gl.LINE_STRIP, 215,2);

        modelViewMatrix= modelViewStack.pop();
       
        modelViewStack.push (modelViewMatrix);
          modelViewMatrix=mult(modelViewMatrix, scale4(0.2,0.2, 1));
  
          gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
          gl.drawArrays( gl.LINE_STRIP, 213,2);
          gl.drawArrays( gl.LINE_STRIP, 215,2);
                  
          modelViewMatrix= modelViewStack.pop();
     
}

function DrawBow()
{ 
        
        modelViewStack.push(modelViewMatrix);
       
        modelViewMatrix=mult(modelViewMatrix, scale4(.9,.9, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
        gl.drawArrays( gl.LINE_STRIP, 228,43);
        modelViewMatrix= modelViewStack.pop();
      
     
       
      
}

function DrawString()
{
        //modelViewMatrix=mat4();
        modelViewStack.push(modelViewMatrix);
        //modelViewMatrix = mult(modelViewMatrix, translate(0,-5.3, 1));
        modelViewMatrix=mult(modelViewMatrix, scale4(.9,.9, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.LINE_STRIP, 271,4);
        modelViewMatrix = modelViewStack.pop();

}



function render() 
{
        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

       // draw ground and sky firsts
        modelViewMatrix=mat4();
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        DrawSkyAndGround();
      
       // draw stars and mountains... next
        DrawMountains();
        DrawStars();
     
     
       // then, draw planet, add rings too
        DrawRingBack();
        DrawFullPlanet();
        DrawRingFront();
       
        if (ghost)
        {
                modelViewMatrix = ghostMatrix;
                if ((ghostStepCount < STEPS)&& (count < SIZE-1))
                {
                    
                        var xstep, ystep;
                        xstep = (nextPosition[0] - prevPosition[0])/100;
                        ystep = (nextPosition[1] - prevPosition[1])/100;
        
                        modelViewMatrix = mult(translate(xstep, ystep, 0), modelViewMatrix);
                        modelViewMatrix=mult(modelViewMatrix, scale4(1, 1, 1));
                        ghostMatrix = modelViewMatrix;
                        ghostStepCount ++;
        
                }
                else if (count < SIZE-1)
                {

                    count ++;
        
                    
                    prevPosition = nextPosition;
                    nextPosition = [(Math.random() * (8 - (-8) + -8)), (Math.random() * (8 - 0) + 0)];
                    
                    ghostStepCount = 0;
                    ghostMatrix = translate(prevPosition[0], prevPosition[1], 0);

                   
                }

                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                DrawGhost();
              
      
        }
       
       // add other things, like bow, arrow, spider, flower, tree ...

        modelViewMatrix=mat4();
        modelViewStack.push(modelViewMatrix);
        modelViewMatrix = mult(modelViewMatrix, translate(0,-5.3, 1));
        modelViewMatrix = mult(modelViewMatrix, rotate(bowAngle, 0, 0, 1));
       
        DrawBow();
        modelViewStack.push(modelViewMatrix);
       if(fire)
       {
                modelViewMatrix = mult(modelViewMatrix, scale4(1, 0.1, 1));
             
       } 
         DrawString();
       modelViewMatrix = modelViewStack.pop();
        

        if(fire)
        {
               // modelViewMatrix=mat4();
                bowMatrix = mult(translate(0, 20.0/STEPS, 0), bowMatrix);
                modelViewMatrix = mult(modelViewMatrix, bowMatrix);
        }

        var limitX = modelViewMatrix[0][3];
        var limitY = modelViewMatrix[1][3];

        if((limitX < -8) || (limitX > 8) || (limitY < -8) || (limitY > 8))
        {
                fire = false;
                ghost = false;
                bowMatrix = mat4();

        }
        
      
        DrawArrow();
       
       modelViewMatrix = modelViewStack.pop();

     
        window.requestAnimFrame(render); 
}