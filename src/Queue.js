const QueueStore = {};

class Queue {
  debug = false;

  constructor(queue, debug = false) {
    this.getQueue(queue);
    this.debug = debug;
  }

  log = (...msg) => {
    if (this.debug) {
      console.log('Queue:', ...msg, QueueStore);
    }
  }

  // queue methods
  getQueue = (queue = 'global') => {
    let newQueue = QueueStore[queue];
    if (newQueue) {
      return newQueue;
    }

    newQueue = [];
    QueueStore[queue] = newQueue;
    this.log('new queue:', queue);
    return newQueue;
  }

  destroyQueue = (queue = true) => {
    // true is to "kill all queues"
    if (queue === true) {
      Object.keys(QueueStore).forEach(this.destroyQueue);
      return;
    }
    
    // kill all objects
    const currQueue = this.getQueue(queue);
    for (let i = currQueue.length - 1; i >= 0; i -= 1) {
      const instance = currQueue[i];
      if (instance.componentWillDestroy) {
        instance.componentWillDestroy();
      }
    }
    // we don't actually clear out the queue at this point - each component lifecycle should handle that
    this.log('destroy queue:', queue);
  }

  // instance methods
  unshift = (instance, queue = 'global') => {
    this.getQueue(queue).unshift(instance);
    this.log('unshift:', queue, instance.id);
  }

  push = (instance, queue = 'global') => {
    this.getQueue(queue).push(instance);
    this.log('push:', queue, instance.id);
  }

  pop = (queue = 'global') => {
    const returnValue = this.getQueue(queue).pop();
    this.log('pop:', queue);
    return returnValue;
  }

  shift = (queue = 'global') => {
    const returnValue = this.getQueue(queue).shift();
    this.log('shift:', queue);
    return returnValue;
  }

  removeBy = (instance) => {
    const { id } = instance;

    Object.keys(QueueStore).forEach(key => {
      const items = QueueStore[key];
      const idx = items.findIndex(item => item.id === id);
      if (idx > -1) {
        items.splice(idx, 1);
        this.log('removeBy:', key, instance.id);
      }
    });
  }
}

const QueueUtil = new Queue('global', true);

export default QueueUtil;
