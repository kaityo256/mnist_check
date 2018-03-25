from __future__ import print_function
import struct
import numpy as np
from model import Model

def main(f_model):
    n_in = 28*28
    #n_middle = 28*28
    n_middle = 1000
    n_out = 10
    model = Model(n_in, n_middle, n_out)
    model.load(f_model)
    p = model.model.predictor
    d = bytearray()
    for v in p.l1.W.data.reshape(n_in*n_middle):
        d += struct.pack('f', v)
    for v in p.l1.b.data:
        d += struct.pack('f', v)
    for v in p.l2.W.data.reshape(n_middle*n_middle):
        d += struct.pack('f', v)
    for v in p.l2.b.data:
        d += struct.pack('f', v)
    for v in p.l3.W.data.reshape(n_middle*n_out):
        d += struct.pack('f', v)
    for v in p.l3.b.data:
        d += struct.pack('f', v)
    open("test.dat", 'w').write(d)
    print("Exported to test.dat")
    a = [0.5]*n_in
    x = np.array([a], dtype=np.float32)
    y = model.predictor(x).data[0]
    print(y)

if __name__ == '__main__':
    main("test.model")
