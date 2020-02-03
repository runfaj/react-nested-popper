import _ from 'lodash';

const QueueStore = {};

class Queue {
  debug = false;
  pushing = {};

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

    if (this.pushing[queue]) {
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

  /* added all the logic for the delayed pushing, but doesn't work if you
  click on your own content. So, probably need to prevent all click outsides
  and have the queue manage which one is actually clicked
  */

  destroyLast = (instance, queue = 'global') => {
    if (this.pushing[queue]) {
      return;
    }
    
    const lowestInstance = _.last(this.getQueue(queue));
    if (lowestInstance.id !== instance.id) {
      return;
    }

    if (instance.componentWillDestroy) {
      instance.componentWillDestroy();
    }
  }

  // instance methods
  unshift = (instance, queue = 'global') => {
    this.getQueue(queue).unshift(instance);
    this.log('unshift:', queue, instance.id);
  }

  push = (instance, queue = 'global') => {
    this.pushing[queue] = true;
    this.getQueue(queue).push(instance);
    this.log('push:', queue, instance.id);
    this.clearPushing(queue);
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

  // misc methods
  clearPushing = _.debounce((queue = 'global') => {
    delete this.pushing[queue];
  }, 250, { leading: false, trailing: true })
}

const QueueUtil = new Queue('global', true);

export default QueueUtil;
