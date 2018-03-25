//------------------------------------------------------------------------
#include <cstdio>
#include <fstream>
#include <string>
#include <sstream>
#include <random>
#include <algorithm>
#include "model.hpp"
//------------------------------------------------------------------------
void
import_test(Model &model) {
  vf x(model.n_in, 0.5);
  vf y = model.predict(x);
  for(auto v: y){
    printf("%f,",v);
  }
  printf("\n");
}
//------------------------------------------------------------------------
void
save_vf_as(const char *filename, vf &x){
  std::cerr << filename << std::endl;
  std::ofstream ofs(filename, std::ios::binary);
  ofs.write((char*)x.data(),sizeof(float)*x.size());
}
//------------------------------------------------------------------------
void
save_vf_sequential(vf &x){
  char filename[256];
  static int index = 0;
  sprintf(filename,"x%04d.vf",index);
  std::ofstream ofs(filename, std::ios::binary);
  ofs.write((char*)x.data(),sizeof(float)*x.size());
  index++;
}
//------------------------------------------------------------------------
void
search_mc(Model &model,const int index){
  std::mt19937 mt;
  std::uniform_real_distribution<double> ud(0.0,1.0);
  std::uniform_int_distribution<int> ui(0,28*28);
  vf x(28*28);
  for(auto &v :x){
    v = ud(mt);
  }
  float energy = model.predict(x)[index];
  for(int i=0;i<10000;i++){
    const int j = ui(mt);
    float xj = x[j];
    x[j] = ud(mt) > 0.5? 1:0;
    float n_energy = model.predict(x)[index];
    if(n_energy > energy){
      energy = n_energy;
    }else{
      x[j] = xj;
    }
    if(i%200==0)save_vf_sequential(x);
  }
  printf("%f\n",energy);
}
//------------------------------------------------------------------------
void
search_gd(Model &model, const int index){
  std::mt19937 mt;
  std::uniform_real_distribution<double> ud(0.0,1.0);
  vf x(28*28);
  for(auto &v :x){
    v = ud(mt);
  }
  float energy = model.predict(x)[index];
  for(int j=0;j<5;j++){
    for(int i=0;i<28*28;i++){
      x[i] = 0.0;
      float energy0 = model.predict(x)[index];
      x[i] = 1.0;
      float energy1 = model.predict(x)[index];
      if(energy0>energy1){
        x[i] = 0.0;
        energy = energy0;
      }else{
        x[i] = 1.0;
        energy = energy1;
      }
    }
    std::cerr << energy << std::endl;
  }
  char filename[256];
  sprintf(filename,"idea_%d.vf",index);
  save_vf_as(filename, x);
}
//------------------------------------------------------------------------
int
main(void) {
  const int n_in = 28*28;
  const int n_units = 28*28;
  //const int n_units = 1000;
  const int n_out = 10;
  Model model(n_in, n_units, n_out);
  model.load("../test.dat");
  //search_mc(model, 5);
  for(int i=0;i<10;i++){
    search_gd(model, i);
  }
}
//------------------------------------------------------------------------
