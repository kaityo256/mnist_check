prevX=0;
prevY=0;
mouseDown=false;
function drawSetup(canvas, canvas2, canvas3){
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
    data28 = makedata(canvas, 28);
    data2canvas(data28, 28, canvas2)
    data20 = makedata(canvas, 20);
    var xg, yg;
    [xg, yg] = centerofmass(data20,20);
    xg -= 10.0;
    yg -= 10.0;
    xg = Math.min(xg, 4.0);
    yg = Math.min(yg, 4.0);
    xg = Math.max(xg, -4.0);
    yg = Math.max(yg, -4.0);
    var data28_s = datashift(xg, yg, data20);
    data2canvas(data28_s, 28, canvas3)
    check(data28, data28_s);
  }
}

function centerofmass(data, size){
  var xg = 1e-12;
  var sum = 1e-12;
  var yg = 1e-12;
  for(var x=0;x<size;x++){
    var xs = 0.0;
    for(var y=0;y<size;y++){
      var s = data[x+size*y];
      xg += s*x;
      yg += s*y;
      sum += s;
    }
  }
  xg /= sum;
  yg /= sum;
  return [xg,yg];
}

function datashift(xg, yg, data){
  var data28 = new Float32Array(28*28);
  data28.fill(0.0);
  for(var x = 0;x<20;x++){
    for(var y = 0;y<20;y++){
      var ix = Math.ceil(x+4-xg);
      var iy = Math.ceil(y+4-yg);
      data28[ix + iy*28] = data[x + y* 20];
    }
  }
  return data28;
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

function makedata(canvas, size){
  var h = canvas.height;
  var w = canvas.width;
  img = canvas.getContext('2d').getImageData(0,0,h,w);
  var data = new Float32Array(size*size);
  data.fill(0.0);
  var m = h/size;
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){
      var sum = 0;
      for(var k=0;k<m;k++){
        for(var l=0;l<m;l++){
          x = i*m+k;
          y = j*m+l;
          var s = x+y*m*size;
          if (img.data[s*4]>128){
            sum++;
          }
        }
      }
    data[i+size*j] = 1.0*sum/m/m;
    }
  }
  return data;
}

function data2canvas(data, size, canvas){
  var h = canvas.height;
  var w = canvas.width;
  var m = h/size;
  img = canvas.getContext('2d').getImageData(0,0,h,w);
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){
      var sum = data[i+size*j]*256;
      for(var k=0;k<m;k++){
        for(var l=0;l<m;l++){
          x = i*m+k;
          y = j*m+l;
          var s = x+y*m*size;
          img.data[s*4] = sum;
          img.data[s*4+1] = sum;
          img.data[s*4+2] = sum;
          img.data[s*4+3] = 255;
        }
      }
    }
  }
  canvas.getContext('2d').putImageData(img,0,0);
}

function canvasClear(canvas){
  var context=canvas.getContext('2d');
  context.fillStyle="black";
  context.fillRect(0,0,canvas.width,canvas.height);
}
