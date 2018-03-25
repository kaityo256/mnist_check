all: a.out

a.out: model.cpp model.hpp
	g++ -std=c++11 -fopenmp -O3 $< -o $@

clean:
	rm -f a.out

png: a.out
	./a.out
	python vf2png.py


clear:
	rm -f a.out *.txt test.model test.dat *.pyc
	rm -rf result
