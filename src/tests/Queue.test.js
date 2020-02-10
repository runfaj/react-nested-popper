import { Queue, QueueStore } from '../Queue';

describe('Queue', () => {
  let QueueUtil, instance1, instance2, instance3;

  beforeEach(() => {
    Object.keys(QueueStore).forEach(key => {
      delete QueueStore[key];
    });
    QueueUtil = new Queue('global');
    instance1 = { id: 1, componentWillDestroy: jest.fn() };
    instance2 = { id: 2, componentWillDestroy: jest.fn() };
    instance3 = { id: 3, componentWillDestroy: jest.fn() };
  });

  it('initializes with empty global queue', () => {
    expect(QueueStore['global']).toStrictEqual([]);
  });

  it('getQueue returns global queue', () => {
    expect(QueueUtil.getQueue()).toStrictEqual([]);
  });

  it('getQueue returns new queue', () => {
    expect(QueueUtil.getQueue('newQueue')).toStrictEqual([]);
    expect(QueueStore['newQueue']).toStrictEqual([]);
  });

  it('_push adds instance to end of queue', () => {
    QueueUtil._push(instance1);
    QueueUtil._push(instance2);
    expect(QueueStore['global'][0]).toBe(instance1);
    expect(QueueStore['global'][1]).toBe(instance2);
    expect(QueueUtil.pushing['global']).toBe(true);
  });

  it('_removeBy splices from queue', () => {
    QueueUtil._push(instance1);
    QueueUtil._push(instance2);
    QueueUtil._push(instance3);
    QueueUtil._removeBy(instance2);
    expect(QueueStore['global'][1]).toBe(instance3);
  });

  it('destroyQueue immediately after push doesn\'t destroy anything', () => {
    QueueUtil._push(instance1);
    QueueUtil.destroyQueue('global');
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(0);
  });

  it('destroyQueue `true` removes from all queues', () => {
    // setup to add and simulate pushing being done
    QueueUtil._push(instance1, 'global');
    QueueUtil._push(instance2, 'newQueue');
    QueueUtil.pushing = {};

    // actual test
    QueueUtil.destroyQueue();
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(1);
    expect(instance2.componentWillDestroy).toHaveBeenCalledTimes(1);
  });

  it('_destroyLast removes last item on queue', () => {
    QueueUtil._push(instance1);
    QueueUtil._push(instance2);
    QueueUtil.pushing = {};

    QueueUtil._destroyLast(instance1);
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(0);
    QueueUtil._destroyLast(instance2);
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(0);
    expect(instance2.componentWillDestroy).toHaveBeenCalledTimes(1);
  });
});
