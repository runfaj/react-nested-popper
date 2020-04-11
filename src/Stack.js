export const StackStore = {};

export class Stack {
  debug = false;
  pushing = {};

  constructor(stack, debug = false) {
    if (stack) {
      this.getStack(stack);
    }
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

  /*  reflow is a special case for "auto" where we provide the indexes of the stack parents. This allows us to
      to close sibling contents. Returns new list of stacks to push content onto.
  */
  _reflow = (targetRef, stacks) => {
    const outputs = [];
    Object.keys(stacks).forEach(parentStack => {
      const foundIdx = stacks[parentStack];
      const parentIsLast = StackStore[parentStack].length - 1 === foundIdx;
      outputs.push(parentStack);

      // move all open siblings to new stack
      if (!parentIsLast) {
        const siblings = StackStore[parentStack].splice(foundIdx + 1);
        const firstSibling = siblings[0];
        const newStack = '_content' + firstSibling.id;
        this.getStack(newStack).push(...siblings);
        for (let i = siblings.length - 1; i >= 0; i -= 1) {
          const instance = siblings[i];
          instance.determinedStack = [newStack];
          if (instance.onOutsideClick) {
            instance.onOutsideClick(targetRef);
          }
        }
      }

      /*
        if someone comes up with the case - we may need to re-address this. Currently, if no poppers have the outside close
        and we have:
           p
          / \
          1 3
          | |
          2 4
        Where the following order opens: p 1 2 3 4,
        then our stacks become
        p 1 2
        3 4
        However, we might want it like
        p 1 3
        1 2
        3 4
        First attempts of this caused weird mis-matches, so we'll need a real-life use case
      */
    });

    return outputs;
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

  /*  debugging helper function to see stack store */
  _getStackStore = () => {
    if (this.debug) {
      return StackStore;
    }
    return null;
  }

  /* given a target, returns all content parent stacks that contain target */
  _getTargetParents = (targetRef) => {
    /*
        Test not written for this method, as it does some dom checking that is very hard to accurately test.
        Essentially, we want to take an input target element and check all the stacks (which contain content
        elements) and see if the target directly belongs to any of those content elements. If so, we track
        the stack name and index it was found.

        So, if I had this:
          StackStore = {
            global: [Content1, Content2, Content3],
            blah: [Content2, Content3],
          }
        And my target was found nested under Content2, my returned value would be
          {
            global: 1,
            blah: 0
          }
        
        This output is mostly useless by itself, but directly used in the _reflow method to close contents
        that are above the found indexes.
    */

    if (!targetRef) {
      return null;
    }

    // generate list of stacks and the index each was found at
    const foundList = {};
    let foundOne = false;
    Object.keys(StackStore).forEach(key => {
      const items = StackStore[key];
      for (let i = 0; i < items.length; i += 1) {
        const content = items[i];
        if (content.popperEl.contains(targetRef)) {
          foundOne = true;
          foundList[key] = i;
          break;
        }
      }
    });

    if (!foundOne) {
      return null;
    }

    return foundList;
  }
}

// we don't export the actual stack util, since we want to always init the package with a global stack available
const StackUtil = new Stack();

export default StackUtil;
