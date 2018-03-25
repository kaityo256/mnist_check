import chainer
from chainer import training
from chainer.training import extensions
import numpy as np
from model import Model

def main():
    train, test = chainer.datasets.get_mnist()
    #m = Model(28*28, 1000, 10)
    m = Model(28*28, 28*28, 10)
    epoch = 20
    batchsize = 1000
    model = m.get_model()
    gpu = -1
    optimizer = chainer.optimizers.Adam()
    optimizer.setup(model)
    train_iter = chainer.iterators.SerialIterator(train, batchsize)
    test_iter = chainer.iterators.SerialIterator(test, batchsize, repeat=False, shuffle=False)
    updater = training.StandardUpdater(train_iter, optimizer, device=gpu)
    trainer = training.Trainer(updater, (epoch, 'epoch'), out='result')
    trainer.extend(extensions.Evaluator(test_iter, model, device=gpu))
    trainer.extend(extensions.dump_graph('main/loss'))
    trainer.extend(extensions.snapshot(), trigger=(epoch, 'epoch'))
    trainer.extend(extensions.LogReport())
    trainer.extend(extensions.PrintReport(
        ['epoch', 'main/loss', 'validation/main/loss',
         'main/accuracy', 'validation/main/accuracy']))
    trainer.extend(extensions.ProgressBar())

    # Training
    trainer.run()
    if gpu >= 0:
        model.to_cpu()
    m.save('test.model')

if __name__ == '__main__':
    main()
