import array
import os

from PIL import Image
def convert(filename):
    f = open(filename, 'rb')
    a = array.array('f')
    a.fromfile(f, 28*28)
    img = Image.new("L", (28, 28))
    pix = img.load()
    for i in range(28):
        for j in range(28):
            pix[i, j] = int(a[i+j*28]*256)
    img2 = img.resize((280, 280))
    pngfile = os.path.splitext(filename)[0] + '.png'
    img2.save(pngfile)
    print filename + " -> " + pngfile

def for_anime():
    for i in range(50):
        vffile = 'x%04d.vf' % i
        convert(vffile)

def for_idea():
    for i in range(10):
        vffile = 'idea_%d.vf' % i
        convert(vffile)

for_idea()
#for_anime()
