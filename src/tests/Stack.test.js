import { Stack, StackStore } from '../Stack';

describe('Stack', () => {
  let StackUtil, instance1, instance2, instance3;

  beforeEach(() => {
    Object.keys(StackStore).forEach(key => {
      delete StackStore[key];
    });
    StackUtil = new Stack('global');
    instance1 = { id: 1, componentWillDestroy: jest.fn(), onOutsideClick: jest.fn() };
    instance2 = { id: 2, componentWillDestroy: jest.fn(), onOutsideClick: jest.fn() };
    instance3 = { id: 3, componentWillDestroy: jest.fn(), onOutsideClick: jest.fn() };
  });

  it('initializes with empty global stack', () => {
    expect(StackStore['global']).toStrictEqual([]);
  });

  it('getStack returns global stack', () => {
    expect(StackUtil.getStack()).toStrictEqual([]);
  });

  it('getStack returns new stack', () => {
    expect(StackUtil.getStack('newStack')).toStrictEqual([]);
    expect(StackStore['newStack']).toStrictEqual([]);
  });

  it('_push adds instance to end of stack - one stack', () => {
    StackUtil._push(instance1);
    StackUtil._push(instance2);
    expect(StackStore['global'][0]).toBe(instance1);
    expect(StackStore['global'][1]).toBe(instance2);
    expect(StackUtil.pushing['global']).toBe(true);
  });

  it('_push adds instance to end of stack - multiple stacks', () => {
    StackUtil._push(instance1, ['newTest1', 'newTest2']);
    expect(StackStore['newTest1'][0]).toBe(instance1);
    expect(StackStore['newTest2'][0]).toBe(instance1);
    expect(StackUtil.pushing['newTest1']).toBe(true);
    expect(StackUtil.pushing['newTest2']).toBe(true);
  });

  it('_reflow manages siblings - parentIsLast', () => {
    StackUtil._push(instance1);
    StackUtil._push(instance2);
    const newStack = '_content' + instance2.id;
    expect(StackStore[newStack]).toBeUndefined();
    const outputs = StackUtil._reflow(null, { global: 1 });
    expect(StackStore[newStack]).toBeUndefined();
    expect(instance1.onOutsideClick).toHaveBeenCalledTimes(0);
    expect(instance2.onOutsideClick).toHaveBeenCalledTimes(0);
    expect(outputs).toEqual(['global']);
  });

  it('_reflow manages siblings - not parentIsLast', () => {
    StackUtil._push(instance1);
    StackUtil._push(instance2);
    const newStack = '_content' + instance2.id;
    expect(StackStore[newStack]).toBeUndefined();
    const outputs = StackUtil._reflow(null, { global: 0 });
    expect(StackStore[newStack][0]).toBe(instance2);
    expect(instance1.onOutsideClick).toHaveBeenCalledTimes(0);
    expect(instance2.onOutsideClick).toHaveBeenCalledTimes(1);
    expect(outputs).toEqual(['global']);
  });

  it('_removeBy splices from stack', () => {
    StackUtil._push(instance1);
    StackUtil._push(instance2);
    StackUtil._push(instance3);
    StackUtil._removeBy(instance2);
    expect(StackStore['global'][1]).toBe(instance3);
  });

  it('destroyStack immediately after push doesn\'t destroy anything', () => {
    StackUtil._push(instance1);
    StackUtil.destroyStack('global');
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(0);
  });

  it('destroyStack destroys a stack - one stack', () => {
    StackUtil._push(instance1);
    StackUtil.pushing = {};
    StackUtil.destroyStack('global');
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(1);
  });

  it('destroyStack destroys a stack - multiple stacks', () => {
    StackUtil._push(instance2, ['newTest1', 'newTest2']);
    StackUtil.pushing = {};
    StackUtil.destroyStack(['newTest1', 'newTest2']);
    expect(instance2.componentWillDestroy).toHaveBeenCalledTimes(1);
  });

  it('destroyStack `true` removes from all stacks', () => {
    // setup to add and simulate pushing being done
    StackUtil._push(instance1, 'global');
    StackUtil._push(instance2, 'newStack');
    StackUtil.pushing = {};

    // actual test
    StackUtil.destroyStack();
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(1);
    expect(instance2.componentWillDestroy).toHaveBeenCalledTimes(1);
  });

  it('_destroyLast removes last item on stack - one stack', () => {
    StackUtil._push(instance1);
    StackUtil._push(instance2);
    StackUtil.pushing = {};

    StackUtil._destroyLast(instance1);
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(0);
    StackUtil._destroyLast(instance2);
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(0);
    expect(instance2.componentWillDestroy).toHaveBeenCalledTimes(1);
  });

  it('_destroyLast removes last item on stack - multiple stacks', () => {
    StackUtil._push(instance1, ['newTest1', 'newTest2']);
    StackUtil._push(instance2, ['newTest1', 'newTest2']);
    StackUtil.pushing = {};

    StackUtil._destroyLast(instance1, ['newTest1', 'newTest2']);
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(0);
    StackUtil._destroyLast(instance2, ['newTest1', 'newTest2']);
    expect(instance1.componentWillDestroy).toHaveBeenCalledTimes(0);
    expect(instance2.componentWillDestroy).toHaveBeenCalledTimes(1);
  });
});
