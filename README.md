# react-nested-popper

[![npm version](https://img.shields.io/npm/v/react-nested-popper.svg)](https://www.npmjs.com/package/react-nested-popper) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

Demos here: <a href="https://growmies.github.io/react-nested-popper/" target="_blank">https://growmies.github.io/react-nested-popper/</a>

## What

react-nested-popper is a react library based on V2 popper.js, but with added features created to handle a number of popper scenarios that other libraries fail to capture:

- handling for nesting and popper groups, combined with outside clicks
- proper handling for context with nested popper content
- full implementation of popper.js allowing all popper options
- support for portals to decouple the popper content

This library is an unstyled, functionality-only library.

## Why

We used react-popper for a long time and have liked it. However, we kept finding that there were situations where we couldn't do things because of the need for queued nested poppers and the inability to upgrade some of our packages. We've tried other similar libraries, but none met our needs. Once popper.js V2 came out, the decision was made to put in the effort to make our own popper library. So...here we are!

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

_Note 1: The Popper must always have 1 Target and 1 Content_
_Note 2: react and react-dom are required peer dependencies_

## Options

The react-nested-popper is created firstly to handle multiple nested poppers. This is achieved by a "queue". By default, all popper instances will be on a "global" queue, but you can create your own queues as needed. 

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
    <td>closeOnOutsideClick</td>
    <td>false</td>
    <td>uncontrolled</td>
    <td>If this is true, enables closing the popper by clicking outside the popper area.</td>
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
    <td>'default' will close the top most open popper in a popper queue. 'group' will close all poppers in a given queue. 'all' will close all poppers in all queue groups.</td>
  </tr>
  <tr>
    <td>targetToggle</td>
    <td>false</td>
    <td>uncontrolled</td>
    <td>Set to true if you want the target to toggle the popper. By default clicking the target will only open the popper.</td>
  </tr>
  <tr>
    <td>groupName</td>
    <td>'global'</td>
    <td>both</td>
    <td>The queue group name that this popper will belong to. For most cases, the default is enough, but if you want multiple poppers open independent of each other, this can be used.</td>
  </tr>
  <tr>
    <td>onOutsideClick</td>
    <td>'(contentInstance, e)=>{}'</td>
    <td>both</td>
    <td>Method called any time a popper is closed by clicking outside. Usually not needed unless a controlled popper.</td>
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
    <td>If something is supposed to close the popper (e.g. Queue.destroyQueue was called), this method will be called so you can update your show attribute accordingly.</td>
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

### Queue

---

You can also manually use the Queue util, should you need. Here's the public methods:
<table>
  <tr>
    <th>Method</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>getQueue(queueName='global')</td>
    <td>Gets the array of popper instances for a given queue name. Creates a new empty queue if queue name isn't previously defined.</td>
  </tr>
  <tr>
    <td>destroyQueue(queueName=true)</td>
    <td>Destroys all popper instances in a queue. Use `true` as the value to destroy all instances in all queues.</td>
  </tr>
</table>

## Misc

This package is published under the MIT License.

Thanks to:
  - <a href="https://www.grow.com/" target="_blank">Grow.com</a>, for the amazing place to work and build software
  - <a href="https://github.com/robskidmore" target="_blank">robskidmore</a>, for helping plan out this package
  - <a href="https://github.com/runfaj" target="_blank">runfaj</a>, for creating this package
  - All contributors (code, issues, documentation, etc.) for helping make this package continually better