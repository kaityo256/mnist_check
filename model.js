Link = function(n_in, n_out, fs) {
  this.n_in = n_in;
  this.n_out = n_out;
  this.W = fs.a.slice(fs.index,fs.index+n_in*n_out);
  fs.index += this.W.length;
  this.b = fs.a.slice(fs.index,fs.index + n_out);
  fs.index += this.b.length;
}
Link.prototype.hello = function(){
  console.log(this.W[0]);
  console.log(this.b[0]);
}
Link.prototype.get = function(x){
  var y = new Float32Array(this.n_out);
  y.fill(0.0);
  for(var i = 0; i < this.n_out; i++){
    y[i] = 0.0;
    for(var j = 0; j < this.n_in; j++){
      y[i] += this.W[i*this.n_in + j]*x[j];
    }
    y[i] += this.b[i];
  }
  return y;
}

Link.prototype.getReLU = function(x){
  var y = this.get(x);
  for(var i=0;i<y.length;i++){
    if(y[i] < 0.0){
      y[i] = 0.0;
    }
  }
  return y;
}

Model = function(fs) {
  this.n_in = 28 * 28;
  this.n_units = 28 * 28;
  //this.n_units = 1000;
  this.n_out = 10;
  this.l1 = new Link(this.n_in, this.n_units, fs);
  this.l2 = new Link(this.n_units, this.n_units, fs);
  this.l3 = new Link(this.n_units, this.n_out, fs);
  var x = new Float32Array(this.n_in);
  x.fill(0.5);
  var y = this.predict(x);
  console.log(y);
}
Model.prototype.predict = function(x){
  y = this.l1.getReLU(x);
  y = this.l2.getReLU(y);
  y = this.l3.get(y);
  return y;
}

Model.prototype.recognize = function(x){
  var y = this.predict(x);
  return y.indexOf(Math.max.apply(null,y));
}

Float32Stream = function(result){
  this.a = new Float32Array(result);
  this.index = 0;
}

