prevX=0;
prevY=0;
mouseDown=false;
function drawSetup(canvas, canvas2){
  canvas.onmousedown = function(e){
    var r = canvas.getBoundingClientRect();
    prevX=e.clientX - r.left;
    prevY=e.clientY - r.top;
    mouseDown=true;
  }
  canvas.onmousemove = function(e){
    if(mouseDown){
      var r = canvas.getBoundingClientRect();
      x =e.clientX - r.left;
      y =e.clientY - r.top;
      draw(x,y, canvas);
    }
  }
  canvas.onmouseup =function(e){
    mouseDown=false;
    copy(canvas, canvas2);
  }
}

function draw(x,y, canvas){
  var context=canvas.getContext('2d');
  context.strokeStyle="white";
  var w = 40;
  context.lineWidth=w;
  context.lineCap="round";
  context.lineJoin="round";
  context.beginPath();
  context.moveTo(prevX,prevY);
  context.lineTo(x,y);
  context.closePath();
  context.stroke();
  prevX=x;  
  prevY=y;
}

function copy(canvas, canvas2){
  var h = canvas.height;
  var w = canvas.width;
  img = canvas.getContext('2d').getImageData(0,0,h,w);
  data = img.data
  for(var i=0;i<28;i++){
    for(var j=0;j<28;j++){
      var sum = 0;
      for(var k=0;k<16;k++){
        for(var l=0;l<16;l++){
          x = i*16+k;
          y = j*16+l;
          var s = x+y*16*28;
          if (data[s*4]>128){
            sum++;
          }
        }
      }
      for(var k=0;k<16;k++){
        for(var l=0;l<16;l++){
          x = i*16+k;
          y = j*16+l;
          var s = x+y*16*28;
          data[s*4] = sum;
          data[s*4+1] = sum;
          data[s*4+2] = sum;
          data[s*4+3] = 255;
        }
      }
    }
  }
  canvas2.getContext('2d').putImageData(img,0,0);
}

function getX(canvas){
  var h = canvas.height;
  var w = canvas.width;
  img = canvas.getContext('2d').getImageData(0,0,h,w);
  var x = new Float32Array(28*28);
  data = img.data
  for(var i=0;i<28;i++){
    for(var j=0;j<28;j++){
      var sum = 0;
      for(var k=0;k<16;k++){
        for(var l=0;l<16;l++){
          sx = i*16+k;
          sy = j*16+l;
          var s = sx+sy*16*28;
          if (data[s*4]>128){
            sum++;
          }
        }
      }
      x[i+j*28] = sum/256.0;
    }
  }
  return x;
}

function canvasClear(canvas){
  var context=canvas.getContext('2d');
  context.fillStyle="black";
  context.fillRect(0,0,canvas.width,canvas.height);
}
