import React, { useState } from 'react';
import classnames from 'classnames/bind';

import PopperThing from './PopperThing';
import DisplayBlock from './DisplayBlock';
import { Popper, Target, Content, Queue } from '../src';

import ContextExample from './ContextExample';
import MobxExample from './MobxExample';
import ReactRouterExample from './ReactRouterExample';

import styles from './app.scss';

const cx = classnames.bind(styles);

const App = () => (
  <div className={cx('app')}>
    <h1>react-nested-popper</h1>
    <p><a href="https://github.com/Growmies/react-nested-popper">https://github.com/Growmies/react-nested-popper</a></p>
    <p>
      react-nested-popper is a react library based on V2
      {' '}
      <a href="https://popper.js.org/" target="_blank">popper.js</a>
      , but with added features created to handle a number of popper scenarios that other libraries fail to capture:
    </p>
    <ul>
      <li>handling for nesting and popper groups, combined with outside clicks</li>
      <li>proper handling for context with nested popper content</li>
      <li>full implementation of popper.js allowing all popper options</li>
      <li>support for portals to decouple the popper content</li>
    </ul>
    <p>This library is an unstyled, functionality-only library, so all of the examples below will demonstrate functionality and available options, combined with custom styling for this demo. You can find all available options and usage via the link above.</p>
    
    <Example1 />
    <Example2 />
    <Example3 />
    <Example4 />
    <Example5 />
    <Example6 />
    <Example7 />
    <Example8 />
    <Example9 />
    <Example10 />
    
    <p>See the github page (link at top) for documentation and happy...popping? 😆<br /><br /></p>
  </div>
);

const Example1 = () => (
  <DisplayBlock
    description="This is a default popper with arrow element included and target will toggle the popper"
    example={(
      <PopperThing />
    )}
    code={(
      `<Popper targetToggle>
  <Target><TargetContent /></Target>
  <Content
    includeArrow
    popperOptions={{
      modifiers: [{
        name: 'offset',
        options: { offset: [0, 10] },
      }],
    }}
  >
    <PopperContent />
  </Content>
</Popper>`
    )}
  />
);

const Example2 = () => (
  <DisplayBlock
    description="Another one placed to the right"
    example={(
      <PopperThing
        placement="right"
      />
    )}
    code={(
      `<Popper targetToggle>
  <Target><PopperTarget /></Target>
  <Content
    includeArrow
    popperOptions={{
      placement: 'right',
      modifiers...
    }}
  >
    <PopperContent />
  </Content>
</Popper>`
    )}
  />
);

const Example3 = () => (
  <DisplayBlock
    description="This one will close when clicking outside the popper content area"
    example={(
      <PopperThing
        closeOnOutsideClick
      />
    )}
    code={(
      `<Popper
  targetToggle
  closeOnOutsideClick
>
  <Target><PopperTarget /></Target>
  <Content
    includeArrow
    popperOptions={...}
  >
    <PopperContent />
  </Content>
</Popper>`
    )}
  />
);

const Example4 = () => (
  <DisplayBlock
    description="Let's try a multi-nested popper. Watch the outside click functionality."
    notes="You'll notice the groupName. This keeps multiple poppers in a queue. All poppers belong to a 'global' queue by default unless manually specified."
    example={(
      <PopperThing
        groupName="nested"
        closeOnOutsideClick
      >
        <PopperThing
          nestedLevel={1}
          groupName="nested"
          closeOnOutsideClick
          placement="right"
        >
          <PopperThing
            nestedLevel={2}
            groupName="nested"
            closeOnOutsideClick
          />
        </PopperThing>
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children }) => (
  <Popper
    targetToggle
    closeOnOutsideClick
    groupName="nested"
  >
    <Target><PopperTarget /></Target>
    <Content
      includeArrow
      popperOptions={...}
    >
      <PopperContent>{children}</PopperContent>
    </Content>
  </Popper>
);

  //
  <PopperInstance>
    <PopperInstance>
      <PopperInstance />
    </PopperInstance>
  </PopperInstance>
`
    )}
  />
);

const Example5 = () => {
  const [show, setShow] = useState(false);
  const [outsideClickCount, setOutsideClickCount] = useState(0);

  const hide = () => {
    setShow(false);
    setOutsideClickCount(0);
  };
  
  return (
    <DisplayBlock
      description="You can also control your own popover if you want."
      note="The only gotcha is controlled popovers are completely self managed, so will not be used in the regular queueing flow. This means you are left to manage hiding and showing each popper."
      example={(
        <div>
          <Popper
            onOutsideClick={() => setOutsideClickCount(outsideClickCount + 1)}
            show={show}
          >
            <Target className={cx('target')}>
              <button onClick={() => setShow(true)}>Show</button>
              <button onClick={hide}>Hide</button>
            </Target>
            <Content
              includeArrow
              className={cx('content', 'nested-0')}
              portalClassName={cx('portal')}
              arrowClassName={cx('arrow')}
              popperOptions={{
                placement: 'right',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 10],
                    },
                  },
                ],
              }}
            >
              Some popper content. Outside Click Count: {outsideClickCount}
              <br />
              <button onClick={hide}>Hide</button>
            </Content>
          </Popper>
        </div>
      )}
      code={(
        `const [show, setShow] = useState(false);
const [outsideClickCount, setOutsideClickCount] = useState(0);

const hide = () => {
  setShow(false);
  setOutsideClickCount(0);
};

return (
  <Popper
    onOutsideClick={() => setOutsideClickCount(outsideClickCount + 1)}
    show={show}
  >
    <Target>
      <button onClick={() => setShow(true)}>Show</button>
      <button onClick={hide}>Hide</button>
    </Target>
    <Content
      includeArrow
      popperOptions={...}
    >
      Some popper content. Outside Click Count: {outsideClickCount}
      <button onClick={hide}>Hide</button>
    </Content>
  </Popper>
);`
      )}
    />
  );
};

const Example6 = () => (
  <DisplayBlock
    description="Here's an example that is the same as the first example, but doesn't use a portal."
    example={(
      <PopperThing noPortal />
    )}
    code={(
      `<Popper
  targetToggle
  usePortal={false}
>
  <Target><TargetContent /></Target>
  <Content
    includeArrow
    popperOptions={...}
  >
    <PopperContent />
  </Content>
</Popper>`
    )}
  />
);

const Example7 = () => (
  <DisplayBlock
    description="This popper uses context with a consumer inside the portal popper content."
    example={(
      <ContextExample />
    )}
    code="See github repo for demo/ContextExample.js"
  />
);

const Example8 = () => (
  <DisplayBlock
    description="This portal popper uses a mobx-state-tree store with mobx-react 5 provider/inject to increment a store value from the content."
    note="This was one of the use cases that prompted creating this package, as other popper libraries all threw errors in this scenario."
    example={(
      <MobxExample />
    )}
    code="See github repo for demo/MobxExample.js"
  />
);

const Example9 = () => (
  <DisplayBlock
    description="This portal popper contains a react-router-dom NavLink without throwing errors."
    note="This was one of the use cases that prompted creating this package, as other popperlibraries all threw errors in this scenario."
    example={(
      <ReactRouterExample />
    )}
    code="See github repo for demo/ReactRouterExample.js"
  />
);

const Example10 = () => (
  <DisplayBlock
    description={(
      <div>
        You already got a taste of queues in a previous example with the nested poppers and clicking outside. You can also manually kill a whole queue of poppers if you want.
        <br /><br />
        Open the 3 poppers belonging to the same group below at the same time. Then, click the "close all" button to see the queue cleared out.
      </div>
    )}
    example={(
      <>
        <div><PopperThing groupName="example10" placement="right" /></div>
        <div><PopperThing groupName="example10" placement="right" /></div>
        <div><PopperThing groupName="example10" placement="right" /></div>
        <div><button onClick={() => Queue.destroyQueue('example10')}>Close All</button></div>
      </>
    )}
    code={(
      `<Popper targetToggle>
  <Target><TargetContent /></Target>
  <Content
    includeArrow
    popperOptions={{
      modifiers: [{
        name: 'offset',
        options: { offset: [0, 10] },
      }],
    }}
  >
    <PopperContent />
  </Content>
</Popper>`
    )}
  />
);

export default App;
