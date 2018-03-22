from __future__ import print_function
import struct
import numpy as np
from model import Model

def main(f_model):
    units = 28*28
    model = Model(units)
    model.load(f_model)
    p = model.model.predictor
    d = bytearray()
    for v in p.l1.W.data.reshape(units*units):
        d += struct.pack('f', v)
    for v in p.l1.b.data:
        d += struct.pack('f', v)
    for v in p.l2.W.data.reshape(units*units):
        d += struct.pack('f', v)
    for v in p.l2.b.data:
        d += struct.pack('f', v)
    for v in p.l3.W.data.reshape(10*units):
        d += struct.pack('f', v)
    for v in p.l3.b.data:
        d += struct.pack('f', v)
    open("test.dat", 'w').write(d)
    print("Exported to test.dat")
    a = [0.5]*units
    x = np.array([a], dtype=np.float32)
    y = model.predictor(x).data[0]
    print(y)

if __name__ == '__main__':
    main("test.model")
