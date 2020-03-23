import React, { useState } from 'react';
import classnames from 'classnames/bind';

import PopperThing from './components/PopperThing';
import DisplayBlock from './components/DisplayBlock';
import { Popper, Target, Content, Stack } from '../src';

import ContextExample from './ContextExample';
import MobxExample from './MobxExample';
import ReactRouterExample from './ReactRouterExample';

import styles from './app.scss';

const cx = classnames.bind(styles);

const App = () => (
  <div className={cx('app')}>
    <h1>react-nested-popper</h1>
    <p><a href="https://github.com/runfaj/react-nested-popper">https://github.com/runfaj/react-nested-popper</a></p>
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
    
    <ExampleBasic />
    <ExampleRight />
    <ExampleOutsideClick />
    <ExampleNested />
    <ExampleMultipleGroup />
    <ExampleControlled />
    <ExampleNoPortal />
    <ExampleContext />
    <ExampleMST />
    <ExampleReactRouter />
    <ExampleDestroy />
    
    <p>See the github page (link at top) for documentation and happy...popping? 😆<br /><br /></p>
  </div>
);

const ExampleBasic = () => (
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

const ExampleRight = () => (
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

const ExampleOutsideClick = () => (
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

const ExampleNested = () => (
  <DisplayBlock
    description="Let's try a multi-nested popper. Watch the outside click functionality."
    notes="You'll notice the groupName. This keeps multiple poppers in a stack. All poppers belong to a 'global' stack by default unless manually specified."
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

const ExampleMultipleGroup = () => (
  <DisplayBlock
    description="Here's another nested popper. However, this one applies multiple groups."
    notes="Notice the group names. The nested poppers each have their own group, but all three belong to a parent group. This allows all three to be controlled via nested outside clicks, but inside the parent, the nested items can alternate being open. An example of this in action might be a popper containing multiple dropdowns where only one dropdown should be open at any time."
    example={(
      <PopperThing
        groupName="multipleGroup"
        closeOnOutsideClick
      >
        <PopperThing
          nestedLevel={1}
          groupName={["multipleGroup", "nested1"]}
          closeOnOutsideClick
        />

        <PopperThing
          nestedLevel={2}
          groupName={["multipleGroup", "nested2"]}
          closeOnOutsideClick
        />
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children, groupName }) => (
  <Popper
    targetToggle
    closeOnOutsideClick
    groupName={groupName}
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
  <PopperInstance groupName="multipleGroup">
    <PopperInstance groupName={["multipleGroup", "nested1"]} />
    <PopperInstance groupName={["multipleGroup", "nested2"]} />
  </PopperInstance>
`
    )}
  />
);

const ExampleControlled = () => {
  const [show, setShow] = useState(false);
  const [outsideClickCount, setOutsideClickCount] = useState(0);

  const hide = () => {
    setShow(false);
    setOutsideClickCount(0);
  };
  
  return (
    <DisplayBlock
      description="You can also control your own popover if you want."
      note="The only gotcha is controlled popovers are completely self managed, so will not be used in the regular stacking flow. This means you are left to manage hiding and showing each popper."
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

const ExampleNoPortal = () => (
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

const ExampleContext = () => (
  <DisplayBlock
    description="This popper uses context with a consumer inside the portal popper content."
    example={(
      <ContextExample />
    )}
    code="See github repo for demo/ContextExample.js"
  />
);

const ExampleMST = () => (
  <DisplayBlock
    description="This portal popper uses a mobx-state-tree store with mobx-react 5 provider/inject to increment a store value from the content."
    note="This was one of the use cases that prompted creating this package, as other popper libraries all threw errors in this scenario."
    example={(
      <MobxExample />
    )}
    code="See github repo for demo/MobxExample.js"
  />
);

const ExampleReactRouter = () => (
  <DisplayBlock
    description="This portal popper contains a react-router-dom NavLink without throwing errors."
    note="This was one of the use cases that prompted creating this package, as other popperlibraries all threw errors in this scenario."
    example={(
      <ReactRouterExample />
    )}
    code="See github repo for demo/ReactRouterExample.js"
  />
);

const ExampleDestroy = () => (
  <DisplayBlock
    description={(
      <div>
        You already got a taste of stacks in a previous example with the nested poppers and clicking outside. You can also manually kill a whole stack of poppers if you want.
        <br /><br />
        Open the 3 poppers belonging to the same group below at the same time. Then, click the "close all" button to see the stack cleared out.
      </div>
    )}
    example={(
      <>
        <div><PopperThing groupName="exampleDestroy" placement="right" /></div>
        <div><PopperThing groupName="exampleDestroy" placement="right" /></div>
        <div><PopperThing groupName="exampleDestroy" placement="right" /></div>
        <div><button onClick={() => Stack.destroyStack('exampleDestroy')}>Close All</button></div>
      </>
    )}
    code={(
      `(Popper from example 2, with groupName="example")
(Popper from example 2, with groupName="example")
(Popper from example 2, with groupName="example")

<button
  onClick={() => Stack.destroyStack('example')}
>Close All</button>`
    )}
  />
);

export default App;
