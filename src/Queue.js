import _debounce from 'lodash/debounce';

export const QueueStore = {};

export class Queue {
  debug = false;
  pushing = {};

  constructor(queue, debug = false) {
    this.getQueue(queue);
    this.debug = debug;
  }

  /* ******** public queue methods ******** */
  /*  gets existing queue by queue name, or creates new empty queue */
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

  /*  destroy one or all queues. "true" will kill all, otherwise will destroy by given name */
  destroyQueue = (queue = true) => {
    if (queue === true) {
      Object.keys(QueueStore).forEach(this.destroyQueue);
      return;
    }

    // if we are pushing to a queue, we don't want to remove anything. Because technically click outside and target
    // click fire together, we have to cancel the destroy that happens in that scenario
    if (this.pushing[queue]) {
      return;
    }
    
    // loop through all objects in given queue and tell them to kill themselves (that sounds so evil)
    // we let the component lifecycles handle the actual removing so we aren't breaking react flows
    const currQueue = this.getQueue(queue);
    for (let i = currQueue.length - 1; i >= 0; i -= 1) {
      const instance = currQueue[i];
      if (instance.componentWillDestroy) {
        instance.componentWillDestroy();
      }
    }
    
    this._log('destroy queue:', queue);
  }

  /* ******** internal methods ******** */
  /*  kind of like a pop method, this will destroy the last instance on a given queue */
  _destroyLast = (instance, queue = 'global') => {
    // see notes in destroyQueue for this pushing flag and the componentWillDestroy
    if (this.pushing[queue]) {
      return;
    }
    
    // get the last instance. We also have to provide an instance to this method because multiple instances could
    // trigger this method on outside click at the same time, so we want to only allow the highest visible instance
    // to destroy itself
    const queueInstance = this.getQueue(queue);
    const lowestInstance = queueInstance[queueInstance.length - 1];
    if (lowestInstance.id !== instance.id) {
      return;
    }

    if (instance.componentWillDestroy) {
      instance.componentWillDestroy();
    }
  }

  /*  push an instance onto a given queue, making it the highest visible in the stack */
  _push = (instance, queue = 'global') => {
    // because onClickOutside can be called at the same time as a push, depending on context, we flag if a push is happening
    this.pushing[queue] = true;
    this.getQueue(queue).push(instance);
    this._log('push:', queue, instance.id);
    this._clearPushing(queue);
  }

  /*  this will manually splice an instance out of the queue. This is called by the component lifecycle, so this
      effectively is a cleanup method
  */
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

  /*  after we push an instance, we need to clear the pushing state. This is debounced so we only clear after all
      possible pushing has completed
  */
  _clearPushing = _debounce((queue = 'global') => {
    delete this.pushing[queue];
  }, 250, { leading: false, trailing: true })

  /*  logging function. Just enable the debug flag on the queue */
  _log = (...msg) => {
    if (this.debug) {
      console.log('Queue:', ...msg, QueueStore);
    }
  }
}

// we don't export the actual queue util, since we want to always init the package with a global queue available
const QueueUtil = new Queue('global');

export default QueueUtil;
