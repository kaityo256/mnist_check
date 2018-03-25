import chainer
import chainer.functions as F
import chainer.links as L
from chainer import training
from chainer.training import extensions

class MLP(chainer.Chain):
    def __init__(self, n_in, n_middle, n_out):
        super(MLP, self).__init__(
            l1=L.Linear(None, n_middle),
            l2=L.Linear(None, n_middle),
            l3=L.Linear(None, n_out)
            )
    def __call__(self, x):
        h1 = F.relu(self.l1(x))
        h2 = F.relu(self.l2(h1))
        return self.l3(h2)

class Model(object):
    def __init__(self, n_in, n_middle, n_out):
        self.model = L.Classifier(MLP(n_in, n_middle, n_out))
    def load(self, filename):
        chainer.serializers.load_npz(filename, self.model)
    def save(self, filename):
        chainer.serializers.save_npz(filename, self.model)
    def predictor(self, x):
        return self.model.predictor(x)
    def get_model(self):
        return self.model
