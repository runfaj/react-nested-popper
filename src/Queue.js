import _ from 'lodash';

const QueueStore = {};

class Queue {
  debug = false;
  pushing = {};

  constructor(queue, debug = false) {
    this.getQueue(queue);
    this.debug = debug;
  }

  // public queue methods
  getQueue = (queue = 'global') => {
    let newQueue = QueueStore[queue];
    if (newQueue) {
      return newQueue;
    }

    newQueue = [];
    QueueStore[queue] = newQueue;
    this._log('new queue:', queue);
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
    this._log('destroy queue:', queue);
  }

  _destroyLast = (instance, queue = 'global') => {
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

  // internal methods
  _push = (instance, queue = 'global') => {
    // because onClickOutside can be called at the same time as a push, depending on context, we flag if a push is happening
    this.pushing[queue] = true;
    this.getQueue(queue).push(instance);
    this._log('push:', queue, instance.id);
    this._clearPushing(queue);
  }

  _removeBy = (instance) => {
    const { id } = instance;

    Object.keys(QueueStore).forEach(key => {
      const items = QueueStore[key];
      const idx = items.findIndex(item => item.id === id);
      if (idx > -1) {
        items.splice(idx, 1);
        this._log('removeBy:', key, instance.id);
      }
    });
  }

  _clearPushing = _.debounce((queue = 'global') => {
    delete this.pushing[queue];
  }, 250, { leading: false, trailing: true })

  _log = (...msg) => {
    if (this.debug) {
      console.log('Queue:', ...msg, QueueStore);
    }
  }
}

const QueueUtil = new Queue('global');

export default QueueUtil;
