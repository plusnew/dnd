# plusnew-dnd [![Coverage Status](https://coveralls.io/repos/github/plusnew/dnd/badge.svg?branch=master)](https://coveralls.io/github/plusnew/dnd)

This library is for typesafe drag-and-drop in plusnew
Beware that this is a very abstract drag and drop library, this library does no dom handling whatsoever.

```ts
import plusnew, { component } from '@plusnew/core';
import dndFactory from '@plusnew/dnd';

// Create a drag-and-drop container
const drag = dndFactory<{id: number}>();

document.addEventListener('mouseUp', drag.stopDrag);

const Component = component(
  'ComponentName',
  () =>
    <span
      onmouseMove={(evt) => drag.moveDrag({x: evt.clientX, y: evt.clientY })}
    >
      <drag.Component
        // onDrop gets called when drag stop happened, no matter where it gets dropped
        // if you want to track if it got dropped above an dom element here,
        // than you need to track that yourself with mouseenter and mouseleave
        onDrop={(dragEvent: {x: number, y: number, payload: { id: number }}) => {
          console.log(dragEvent.deltaPosition.x, dragEvent.deltaPosition.y); // In these variables are the delta positions, how much it moved compared to the startPosition
          console.log(dragEvent.payload); // This contains the payload value which was called at drag.startDrag
        }
      }>{(dragState): { active: false } { active: true, deltaPosition: { x: number, y: number }, payload: { id: number }} =>
        <span
          onmouseDown={evt => drag.startDrag({
            position: {
              x: evt.clientX, // start position, from where 
              y: evt.clientY,
            },
            payload: {
              id: 0
            }
          })}
        />
      }</Drag>
    </span>
)
```
