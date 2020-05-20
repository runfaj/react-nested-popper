import React, { useState } from 'react';
import classnames from 'classnames/bind';
import { HashRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

import PopperThing from './components/PopperThing';
import DisplayBlock from './components/DisplayBlock';
import { Popper, Target, Content, Stack } from '../src';

import ContextExample from './ContextExample';
import MobxExample from './MobxExample';
import ReactRouterExample from './ReactRouterExample';

import styles from './app.scss';

const cx = classnames.bind(styles);

const App = () => {
  return (
    <div className={cx('app')}>
      <Router basename="/">
        <Sidebar />
        
        <div className={cx('mainContent')}>
          <Switch>
            <Route path="/basic">
              <ExampleBasic />
              <ExampleRight />
              <ExampleOutsideClick />
              <ExampleNoPortal />
            </Route>
            <Route path="/nested">
              <ExampleNestedAuto />
              <ExampleNested />
              <ExampleNestedAutoNoClose />
              <ExampleNestedNoClose />
            </Route>
            <Route path="/multiple">
              <ExampleMultipleGroupAuto />
              <ExampleMultipleGroup />
              <ExampleMultipleGroupAutoNested />
              <ExampleMultipleGroupAutoNestedNoClose />
            </Route>
            <Route path="/controlled">
              <ExampleControlled />
              <ExampleControlledNested />
            </Route>
            <Route path="/external">
              <ExampleContext />
              <ExampleMST />
              <ExampleReactRouter />
            </Route>
            <Route path="/misc">
              <ExampleDestroy />
            </Route>
            <Route path="/">
              <Intro />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

const renderLink = (name, path) => (
  <NavLink
    to={path}
    exact
    className={cx('navItem')}
    activeClassName={cx('active')}
  >
    {name}
  </NavLink>
);

const Sidebar = () => (
  <nav className={cx('sidebar')}>
    <div className={cx('title')}>
      react-nested-popper
    </div>

    <div className={cx('libLinks')}>
      <a target="_blank" href="https://github.com/runfaj/react-nested-popper">github</a>
      <a target="_blank" href="https://www.npmjs.com/package/react-nested-popper">npm</a>
    </div>

    {renderLink('Intro/Links', '/')}
    {renderLink('Basic Poppers', '/basic')}
    {renderLink('Nested Poppers', '/nested')}
    {renderLink('Nested Popper Siblings', '/multiple')}
    {renderLink('Controlled Poppers', '/controlled')}
    {renderLink('External Libraries', '/external')}
    {renderLink('Misc', '/misc')}
  </nav>
);

/* ************* basic ************* */

const Intro = () => (
  <>
    <h1>react-nested-popper</h1>
    <div className={cx('libLinks', 'intro')}>
      <a target="_blank" href="https://github.com/runfaj/react-nested-popper">github</a>
      <a target="_blank" href="https://www.npmjs.com/package/react-nested-popper">npm</a>
    </div>
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
    <p>This library is an unstyled, functionality-only library, so all of the examples will demonstrate functionality and available options, combined with custom styling for this demo. You can find all available options and usage via the link above.</p>
  </>
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
    description="Same example, but placed to the right"
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
        shouldCloseOnOutsideClick={() => true}
      />
    )}
    code={(
      `<Popper
  targetToggle
  shouldCloseOnOutsideClick={() => true}
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

/* ************* nested ************* */

const ExampleNestedAuto = () => (
  <DisplayBlock
    description="Let's try a multi-nested popper. Watch the outside click functionality."
    example={(
      <PopperThing
        shouldCloseOnOutsideClick={() => true}
      >
        <PopperThing
          nestedLevel={1}
          shouldCloseOnOutsideClick={() => true}
          placement="right"
        >
          <PopperThing
            nestedLevel={2}
            shouldCloseOnOutsideClick={() => true}
          />
        </PopperThing>
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children }) => (
  <Popper
    targetToggle
    shouldCloseOnOutsideClick={() => true}
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

const ExampleNested = () => (
  <DisplayBlock
    description="Here's the same example, but with custom defined groupName props."
    notes="The groupName is used to keeps multiple poppers in a stack. You can use this to have custom stacks open independently."
    example={(
      <PopperThing
        groupName="nested"
        shouldCloseOnOutsideClick={() => true}
      >
        <PopperThing
          nestedLevel={1}
          groupName="nested"
          shouldCloseOnOutsideClick={() => true}
          placement="right"
        >
          <PopperThing
            nestedLevel={2}
            groupName="nested"
            shouldCloseOnOutsideClick={() => true}
          />
        </PopperThing>
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children }) => (
  <Popper
    targetToggle
    shouldCloseOnOutsideClick={() => true}
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

const ExampleNestedAutoNoClose = () => (
  <DisplayBlock
    description="Here's the same as the first example (auto groupName), but without the outside click close."
    example={(
      <PopperThing
      >
        <PopperThing
          nestedLevel={1}
          placement="right"
        >
          <PopperThing
            nestedLevel={2}
          />
        </PopperThing>
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children }) => (
  <Popper
    targetToggle
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

const ExampleNestedNoClose = () => (
  <DisplayBlock
    description="Here's the same as the second example (custom groupName), but without the outside click close."
    example={(
      <PopperThing
        groupName="nestednoclose"
      >
        <PopperThing
          nestedLevel={1}
          groupName="nestednoclose"
          placement="right"
        >
          <PopperThing
            nestedLevel={2}
            groupName="nestednoclose"
          />
        </PopperThing>
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children }) => (
  <Popper
    targetToggle
    groupName="nestednoclose"
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

/* ************* multiple group ************* */

const ExampleMultipleGroupAuto = () => (
  <DisplayBlock
    description="This nested popper applies multiple groups."
    notes="With auto nesting, nested poppers will layer, but only one sibling in a popper can be open at the same time.  An example of this in action might be a popper containing multiple dropdowns where only one dropdown should be open at any time."
    example={(
      <PopperThing
        shouldCloseOnOutsideClick={() => true}
      >
        <PopperThing
          nestedLevel={1}
          shouldCloseOnOutsideClick={() => true}
        />

        <PopperThing
          nestedLevel={2}
          shouldCloseOnOutsideClick={() => true}
        />
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children }) => (
  <Popper
    targetToggle
    shouldCloseOnOutsideClick={() => true}
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
    <PopperInstance/>

    <PopperInstance/>
  </PopperInstance>
`
    )}
  />
);

const ExampleMultipleGroup = () => (
  <DisplayBlock
    description="This is the same as above, but with custom groupNames."
    notes="Notice the group names. The nested poppers each have their own group, but all three belong to a parent group. This allows all three to be controlled via nested outside clicks, but inside the parent, the nested items can alternate being open."
    example={(
      <PopperThing
        groupName="multipleGroup"
        shouldCloseOnOutsideClick={() => true}
      >
        <PopperThing
          nestedLevel={1}
          groupName={["multipleGroup", "nested1"]}
          shouldCloseOnOutsideClick={() => true}
        />

        <PopperThing
          nestedLevel={2}
          groupName={["multipleGroup", "nested2"]}
          shouldCloseOnOutsideClick={() => true}
        />
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children, groupName }) => (
  <Popper
    targetToggle
    shouldCloseOnOutsideClick={() => true}
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

const ExampleMultipleGroupAutoNested = () => (
  <DisplayBlock
    description="This combines multiple levels of auto nesting, but includes siblings."
    example={(
      <PopperThing
        shouldCloseOnOutsideClick={() => true}
      >
        <PopperThing
          nestedLevel={1}
          shouldCloseOnOutsideClick={() => true}
        >
          <PopperThing
            nestedLevel={3}
            shouldCloseOnOutsideClick={() => true}
          />
        </PopperThing>

        <PopperThing
          nestedLevel={2}
          shouldCloseOnOutsideClick={() => true}
        >
          <PopperThing
            nestedLevel={4}
            shouldCloseOnOutsideClick={() => true}
          />
        </PopperThing>
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children }) => (
  <Popper
    targetToggle
    shouldCloseOnOutsideClick={() => true}
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
    <PopperInstance>

    <PopperInstance>
      <PopperInstance />
    <PopperInstance>
  </PopperInstance>
`
    )}
  />
);

const ExampleMultipleGroupAutoNestedNoClose = () => (
  <DisplayBlock
    description="For brevity, here's the same as the last example, but without the outside close."
    example={(
      <PopperThing
      >
        <PopperThing
          nestedLevel={1}
        >
          <PopperThing
            nestedLevel={3}
          />
        </PopperThing>

        <PopperThing
          nestedLevel={2}
        >
          <PopperThing
            nestedLevel={4}
          />
        </PopperThing>
      </PopperThing>
    )}
    code={(
      `const PopperInstance = ({ children }) => (
  <Popper
    targetToggle
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
    <PopperInstance>

    <PopperInstance>
      <PopperInstance />
    <PopperInstance>
  </PopperInstance>
`
    )}
  />
);

/* ************* controlled ************* */

const ExampleControlled = () => {
  const [show, setShow] = useState(false);
  const [outsideClickCount, setOutsideClickCount] = useState(0);

  const hide = () => {
    setShow(false);
    setOutsideClickCount(0);
  };
  
  return (
    <DisplayBlock
      description="You can also control your own popover if you want. This is a super simple example of a single popper."
      notes="In this example, the controlled popover is completely self managed, so will not be used in the regular stacking flow. This means you are left to manage hiding and showing each popper."
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

const ExampleControlledNested = () => {
  const PopperInstance = ({ children, nestedLevel }) => {
    const [show, setShow] = useState(false);

    return (
      <Popper
        shouldCloseOnOutsideClick={() => true}
        onPopperWillClose={() => setShow(false)}
        show={show}
        onTargetClick={() => setShow(!show)}
      >
        <Target className={cx('target')}>
          <button>Toggle</button>
        </Target>
        <Content
          includeArrow
          className={cx('content', 'nested-' + nestedLevel)}
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
          Some popper content.
          <br />
          {children}
        </Content>
      </Popper>
    );
  };

  return (
    <DisplayBlock
      description="This example shows controlled nested popovers."
      notes="In this example, each popper is controlled, but uses the target click and onPopperWillClose to tell you when to close each popper."
      example={(
        <div>
          <PopperInstance nestedLevel="0">
            <PopperInstance nestedLevel="1">
              <PopperInstance nestedLevel="2" />
            </PopperInstance>
          </PopperInstance>
        </div>
      )}
      code={(
        `const PopperInstance = ({ children }) => {
  const [show, setShow] = useState(false);

  return (
    <Popper
      shouldCloseOnOutsideClick={() => true}
      onPopperWillClose={() => setShow(false)}
      show={show}
      onTargetClick={() => setShow(!show)}
    >
      <Target>
        <button>Toggle</button>
      </Target>
      <Content
        includeArrow
        popperOptions={...}
      >
        Some popper content.
        <br />
        {children}
      </Content>
    </Popper>
  );
};

//
<PopperInstance>
  <PopperInstance>
    <PopperInstance />
  <PopperInstance>
</PopperInstance>
`
      )}
    />
  );
};

/* ************* external libraries ************* */

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
    notes="This was one of the use cases that prompted creating this package, as other popper libraries all threw errors in this scenario."
    example={(
      <MobxExample />
    )}
    code="See github repo for demo/MobxExample.js"
  />
);

const ExampleReactRouter = () => (
  <DisplayBlock
    description="This portal popper contains a react-router-dom NavLink without throwing errors."
    notes="This was one of the use cases that prompted creating this package, as other popperlibraries all threw errors in this scenario."
    example={(
      <ReactRouterExample />
    )}
    code="See github repo for demo/ReactRouterExample.js"
  />
);

/* ************* misc ************* */

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
