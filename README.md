# react-nested-popper

[![npm version](https://img.shields.io/npm/v/react-nested-popper.svg)](https://www.npmjs.com/package/react-nested-popper) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

Demos here: <a href="https://runfaj.github.io/react-nested-popper/" target="_blank">https://runfaj.github.io/react-nested-popper/</a>

## What

react-nested-popper is a react library based on V2 popper.js, but with added features created to handle a number of popper scenarios that other libraries fail to capture:

- handling for nesting and popper groups, combined with outside clicks
- proper handling for context with nested popper content
- full implementation of popper.js allowing all popper options
- support for portals to decouple the popper content

This library is an unstyled, functionality-only library.

## Why

We used react-popper for a long time and have liked it. However, we kept finding that there were situations where we couldn't do things because of the need for stackd nested poppers and the inability to upgrade some of our packages. We've tried other similar libraries, but none met our needs. Once popper.js V2 came out, the decision was made to put in the effort to make our own popper library. So...here we are!

## Installation

Install the Package:
`npm install react-nested-popper` or `yarn add react-nested-popper`

Add to your jsx file:
```
import { Popper, Target, Content } from 'react-nested-popper';

// render
<Popper>
  <Target>{/* The target that the popper is tied to here */}</Target>
  <Content>{/* The content to appear in the popper here */}</Content>
</Popper>
```

_Note 1: The Popper must always have 1 Target and 1 Content_\
_Note 2: react and react-dom are required peer dependencies_

## Options

The react-nested-popper is created firstly to handle multiple nested poppers. This is achieved by a "stack". By default, all popper instances will determine their own stack, but you can create your own stacks as needed. 

In addition, you can create a controlled popper (the hide/show state is managed by you), or an uncontrolled popper (the hide/show state is managed by the library).

With that in mind, here's the options available for the three components:

### Popper

---

<table>
  <tr>
    <th>Prop</th>
    <th>Default value</th>
    <th>Controlled or Uncontrolled</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>initiallyOpen</td>
    <td>false</td>
    <td>uncontrolled</td>
    <td>Set to true to have the popper initially open when mounted.</td>
  </tr>
  <tr>
    <td>outsideClickType</td>
    <td>'default'</td>
    <td>uncontrolled</td>
    <td>'default' will close the top most open popper in a popper stack. 'group' will close all poppers in a given stack. 'all' will close all poppers in all stack groups.</td>
  </tr>
  <tr>
    <td>targetToggle</td>
    <td>false</td>
    <td>uncontrolled</td>
    <td>Set to true if you want the target to toggle the popper. By default clicking the target will only open the popper.</td>
  </tr>
  <tr>
    <td>shouldCloseOnOutsideClick</td>
    <td>(e) => false</td>
    <td>both</td>
    <td>If this returns true, enables closing the popper by clicking outside the popper area.</td>
  </tr>
  <tr>
    <td>groupName</td>
    <td>'auto'</td>
    <td>both</td>
    <td>See section below on the groupName.</td>
  </tr>
  <tr>
    <td>onOutsideClick</td>
    <td>'(contentInstance, e)=>{}'</td>
    <td>both</td>
    <td>Method called any time a click occurs outside the popper content (target excluded). Convenience method only. Use onPopperWillClose to handle controlled closing.</td>
  </tr>
  <tr>
    <td>portalClassName</td>
    <td>''</td>
    <td>both</td>
    <td>Classname string to add to the portal element.</td>
  </tr>
  <tr>
    <td>portalRoot</td>
    <td>'<body>'</td>
    <td>both</td>
    <td>If you want your portal to appear somewhere other than the end of the body, specify the target dom element to put it in.</td>
  </tr>
  <tr>
    <td>usePortal</td>
    <td>true</td>
    <td>both</td>
    <td>Set to false to not use a portal and just do the popper in the same element location.</td>
  </tr>
  <tr>
    <td>onPopperWillClose</td>
    <td>'()=>{}'</td>
    <td>controlled</td>
    <td>If something is supposed to close the popper (e.g. Stack.destroyStack was called), this method will be called so you can update your show attribute accordingly.</td>
  </tr>
  <tr>
    <td>onTargetClick</td>
    <td>'(e)=>{}'</td>
    <td>controlled</td>
    <td>Method to call when the target is clicked on. Useful if you don't want to wrap the target content in another element (e.g. text only).</td>
  </tr>
  <tr>
    <td>show</td>
    <td>null</td>
    <td>controlled</td>
    <td>If not null or undefined, setting this to true/false makes the popper a controlled component.</td>
  </tr>
</table>

<br />

### Target

---

<table>
  <tr>
    <th>Prop</th>
    <th>Default value</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>className</td>
    <td>''</td>
    <td>Classname string to add to the target element.</td>
  </tr>
  <tr>
    <td>innerRef</td>
    <td>'(el) => {}'</td>
    <td>If you need a ref to the target element for some reason, use this.</td>
  </tr>
</table>

<br />

### Content

---

<table>
  <tr>
    <th>Prop</th>
    <th>Default value</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>arrowClassName</td>
    <td>''</td>
    <td>Classname string to add to the arrow element.</td>
  </tr>
  <tr>
    <td>className</td>
    <td>''</td>
    <td>Classname string to add to the content element.</td>
  </tr>
  <tr>
    <td>includeArrow</td>
    <td>false</td>
    <td>Adds the arrow element (with data-popper-arrow attribute) if you want your popper to have an arrow. See <a href="https://popper.js.org/docs/v2/tutorial/" target="_blank">popper.js</a> for styling your arrow.</td>
  </tr>
  <tr>
    <td>innerRef</td>
    <td>'(el) => {}'</td>
    <td>If you need a ref to the content element for some reason, use this.</td>
  </tr>
  <tr>
    <td>onClick</td>
    <td>'(e) => {}'</td>
    <td>Regular onClick method for clicking in the content area if needed.</td>
  </tr>
  <tr>
    <td>popperOptions</td>
    <td>{}</td>
    <td>Standard object of popper options as outlined by <a href="https://popper.js.org/docs/v2/tutorial/" target="_blank">popper.js</a>.</td>
  </tr>
</table>

<br />

### Stack

---

You can also manually use the Stack util, should you need. Here's the public methods:
<table>
  <tr>
    <th>Method</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>getStack(stackName='global')</td>
    <td>Gets the array of popper instances for a given stack name. Creates a new empty stack if stack name isn't previously defined.</td>
  </tr>
  <tr>
    <td>destroyStack(stackName=true)</td>
    <td>Destroys all popper instances in a stack. Use `true` as the value to destroy all instances in all stacks.</td>
  </tr>
</table>

## groupName

```
<Popper
  (default case: groupName="auto")
  (or)
  groupName="string"
  (or)
  groupName={["string", "string"]}
>
```

The group name for popper is a bit complicated, so merits some explanation.

The group name on a popper specifies which group(s) a set of poppers belongs to. For example, if you wanted to have two poppers open at the same time, but then close in the order you opened them, you could specify each popper to belong to the same group. Alternately, you could have two poppers open at the same time and close at the same time with different groups.

This is also useful for nesting, as nesting poppers and putting them in the same group will only close the top most item in the group when clicking outside. The opposite with different groups might be dropdowns where only one should be open at a given time.

With all of these cases, please see the demos to visually see how the group name affects nesting. **First we'll look at custom group names, then the default "auto" case.**

#### Single group

You can define the groupName as any string you'd like (except "auto"). For example, here's a "global" group:
```
<Popper
  groupName="global"
>
```

Depending on the need, you may need to have a set of poppers belong to a different group though. For example, maybe you want multiple popovers to open independent of each other.
```
<Popper
  groupName="popper1"
>
<Popper
  groupName="popper2"
>
```

If you define multiple poppers as the same group (regardless of physically nested or not), they will close in the opposite order they were opened.
```
<Popper
  groupName="global"
>
<Popper
  groupName="global"
>
```

#### Multiple groups

Sometimes, a single group name for poppers isn't enough, like having a nested popper, but each nested item should toggle from other items. What does this mean? Let's look at a specific example.

Say I made a component that was a popper with a form inside. On this form were two dropdowns, each being their own popper component. In this situation, I might want to keep the parent popper open, but only allow one child dropdown to be open at a time.

We can't accomplish this with just one group because the dropdowns need to have separate groups to only allow one to be open. But, they both need to belong to the parent popper group. So, that's where multiple group names are needed.
```
<Popper
  groupName="popper"
>
  <Dropdown
    groupName={["popper", "dropdown1"]}
  >
  <Dropdown
    groupName={["popper", "dropdown2"]}
  >
</Popper>
```
The array of group names is arranged from lowest to highest group, so in this case, the lowest open item would be the popper group, then the dropdown group.

#### Default "auto" case

By default, groupName will be "auto". This means that the nesting will try to determine stacks by itself. With auto, the functionality behaves as follows:

1. If no other popper is open, create a new stack and add this popper to it.
2. If another popper is open, look to see if the target for this popper belongs to the open popper:
    - If doesn't belong to another popper, add to new stack.
    - If belongs to another popper:
      1. find the parent popper in the stack.
      2. Move any poppers that are children of the parent to a new stack
      3. Add the new popper to the same stack as the parent.

To interpret these rules, we basically do somemthing similar to the example mentioned in the Multiple Groups above, but automatically determine the group names so you don't have to.

#### How groupName actually works

This is the main point of this package. Basically, when a popper belongs to a group, we create a stack of poppers that belong to the given groups defined for each popper. We use this stack to track the last opened item and only close the last opened item in the group.

With multiple groups, we treat the multiple groups as a mini-stack as well, where we only close the last item of the list of groups where a group contains an item. Confused yet? Anyway, this approach allows for binding multiple groups while only closing the top most item as needed each time.


## Misc

This package is published under the MIT License.

Thanks to:
  - <a href="https://www.grow.com/" target="_blank">Grow.com</a>, for the amazing place to work and build software
  - <a href="https://github.com/robskidmore" target="_blank">robskidmore</a>, for helping plan out this package
  - <a href="https://github.com/runfaj" target="_blank">runfaj</a>, for creating this package
  - All contributors (code, issues, documentation, etc.) for helping make this package continually better

## FAQ

- **What's with all the weird dependencies?** Nearly all the dependencies listed are for the demo. The webpack bundle splits out to where the only things that are actually used in this package are a couple lodash methods and the popperjs library. react and react-dom are not included as they are peer dependencies.