#pragma once
//------------------------------------------------------------------------
#include <iostream>
#include <fstream>
#include <vector>
#include <math.h>
#include <algorithm>
//------------------------------------------------------------------------
typedef std::vector<float> vf;
//------------------------------------------------------------------------
class Link {
private:
  float relu(float x) {
    return (x > 0) ? x : 0;
  }
public:
  vf W;
  vf b;
  const int n_in, n_out;
  Link(int in, int out) : n_in(in), n_out(out) {
    W.resize(n_in * n_out);
    b.resize(n_out);
  }
  void read(std::ifstream &ifs) {
    ifs.read((char*)W.data(), sizeof(float)*n_in * n_out);
    ifs.read((char*)b.data(), sizeof(float)*n_out);
  }

  vf get(vf x) {
    vf y(n_out);
#pragma omp parallel for
    for (int i = 0; i < n_out; i++) {
      y[i] = 0.0;
      for (int j = 0; j < n_in; j++) {
        y[i] += W[i * n_in + j] * x[j];
      }
      y[i] += b[i];
    }
    return y;
  }

  vf get_relu(vf x) {
    vf y = get(x);
    for (int i = 0; i < n_out; i++) {
      y[i] = relu(y[i]);
    }
    return y;
  }
};
//------------------------------------------------------------------------
class Model {
private:
  Link l1, l2, l3;
public:
  const int n_in, n_out;
  Model(int in, int n_units, int out):
    l1(in, n_units), l2(n_units, n_units), l3(n_units, out),
    n_in(in), n_out(out) {
  }
  void load(const char* filename) {
    std::ifstream ifs(filename);
    if (ifs.fail()) {
      std::cerr << "Could not read file " << filename << std::endl;
    }
    l1.read(ifs);
    l2.read(ifs);
    l3.read(ifs);
  }
  vf predict(vf &x) {
    return l3.get(l2.get_relu(l1.get_relu(x)));
  }

  int argmax(vf &x) {
    vf y = predict(x);
    auto it = std::max_element(y.begin(), y.end());
    auto index = std::distance(y.begin(), it);
    return index;
  }
};
//------------------------------------------------------------------------
