export const StackStore = {};

export class Stack {
  debug = false;
  pushing = {};

  constructor(stack, debug = false) {
    this.getStack(stack);
    this.debug = debug;
  }

  /* ******** public stack methods ******** */
  /*  gets existing stack by stack name, or creates new empty stack */
  getStack = (stack = 'global') => {
    let newStack = StackStore[stack];
    if (newStack) {
      return newStack;
    }

    newStack = [];
    StackStore[stack] = newStack;
    this._log('new stack:', stack);
    return newStack;
  }

  /*  destroy one or all stacks. "true" will kill all, otherwise will destroy by given names */
  destroyStack = (stacks = true) => {
    if (stacks === true) {
      Object.keys(StackStore).forEach(this.destroyStack);
      return;
    }

    if (typeof stacks === 'string') {
      stacks = [stacks];
    }

    // stacks are provided in a stack (not confusing at all). Only destroy the highest stack
    // in the list that contains items
    for (let q = stacks.length - 1; q >= 0; q -= 1) {
      const stackName = stacks[q];
      const currStack = this.getStack(stackName);
      if (currStack.length > 0) {
        // if we are pushing to a stack, we don't want to remove anything. Because technically click outside and target
        // click fire together, we have to cancel the destroy that happens in that scenario
        if (this.pushing[stackName]) {
          return;
        }

        // loop through all objects in given stack and tell them to kill themselves (that sounds so evil)
        // we let the component lifecycles handle the actual removing so we aren't breaking react flows
        for (let i = currStack.length - 1; i >= 0; i -= 1) {
          const instance = currStack[i];
          if (instance.componentWillDestroy && !instance.isDestroying) {
            instance.componentWillDestroy();
          }
        }

        this._log('destroy stack:', stackName);

        break;
      }
    }
  }

  /* ******** internal methods ******** */
  /*  kind of like a pop method, this will destroy the last instance on a given stack
      See notes in destroyStack for the multiple stacks
  */
  _destroyLast = (instance, stacks = 'global') => {
    if (typeof stacks === 'string') {
      stacks = [stacks];
    }

    // stacks are provided in a stack (not confusing at all). Only destroy the highest stack
    // in the list that contains items
    for (let q = stacks.length - 1; q >= 0; q -= 1) {
      const stackName = stacks[q];
      const currStack = this.getStack(stackName);
      if (currStack.length > 0) {
        if (this.pushing[stackName]) {
          return;
        }
        
        // get the last instance. We also have to provide an instance to this method because multiple instances could
        // trigger this method on outside click at the same time, so we want to only allow the highest visible instance
        // to destroy itself
        const lowestInstance = currStack[currStack.length - 1];
        if (lowestInstance.id !== instance.id) {
          return;
        }

        this._log('_destroyLast: should destroy:', instance.id, instance.isDestroying);
        if (instance.componentWillDestroy && !instance.isDestroying) {
          instance.componentWillDestroy();
        }

        break;
      }
    }
  }

  /*  push an instance onto a given stack, making it the highest visible in the stack */
  _push = (instance, stacks = 'global') => {
    if (typeof stacks === 'string') {
      stacks = [stacks];
    }

    stacks.forEach(stack => {
      // because onClickOutside can be called at the same time as a push, depending on context, we flag if a push is happening
      this.pushing[stack] = true;
      this.getStack(stack).push(instance);
      this._log('push:', stack, instance.id);
      this._clearPushing(stack);
    });
  }

  /*  this will manually splice an instance out of the stack. This is called by the component lifecycle, so this
      effectively is a cleanup method
  */
  _removeBy = (instance) => {
    const { id } = instance;

    Object.keys(StackStore).forEach(key => {
      const items = StackStore[key];
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
  _clearPushing = (stack = 'global') => {
    setTimeout(() => {
      if (this.pushing[stack]) {
        delete this.pushing[stack];
      }
    }, 250);
  }

  /*  logging function. Just enable the debug flag on the stack */
  _log = (...msg) => {
    if (this.debug) {
      console.log('Stack:', ...msg, StackStore);
    }
  }
}

// we don't export the actual stack util, since we want to always init the package with a global stack available
const StackUtil = new Stack('global');

export default StackUtil;
