import plusnew, { Component, ApplicationElement, ComponentContainer, Props, store } from 'plusnew';

type isNotDragging = {
  isDraggingActive: false;
  isDraggedOver: false;
};

type isDragging<target> = {
  isDraggingActive: true;
  target: target;
  isDraggedOver: boolean;
};

type dragState<target> = isDragging<target> | isNotDragging;

type DragProps<target> = {
  onDragStart?: () => target;
  onDragEnd?: (target: target) => void;
  render: (drag: dragState<target>) => ApplicationElement;
};

type DragComponent<target> = ComponentContainer<DragProps<target>>;

function factory<target>() {
  type dragState = { isDraggingActive: false } | { isDraggingActive: true, target: target };

  const dragStore = store({ isDraggingActive: false } as dragState, (_state, action: dragState) => action);

  return class Drag extends Component<DragProps<target>> {
    displayName = "Drag";
    draggedOver = store(false, (_state, action: boolean) => action);

    dragEnd = () => {
      this.draggedOver.dispatch(false);
      dragStore.dispatch({ isDraggingActive: false });
    }

    componentWillUnmount() {
      window.removeEventListener('dragend', this.dragEnd)
    }
    render(Props: Props<DragProps<target>>) {

      window.addEventListener('dragend', this.dragEnd)

      return <Props render={({ onDragStart, onDragEnd, render }) =>
        <this.draggedOver.Observer render={(draggedOverState) =>
          <dragStore.Observer render={(dragState) =>
            <span
              { ...(onDragStart !== undefined && {
                draggable: 'true',
                ondragstart: () => dragStore.dispatch({ isDraggingActive: true, target: onDragStart()}),
              })}
              ondragenter = {() => dragState.isDraggingActive === true && this.draggedOver.dispatch(true)}
              ondragleave = {() => dragState.isDraggingActive === true && this.draggedOver.dispatch(false)}
              ondragend = {() => dragState.isDraggingActive === true && onDragEnd && onDragEnd(dragState.target)}
            >
              {render({
                ...dragState,
                ... (dragState.isDraggingActive === true && { target: dragState.target }),
                isDraggedOver: draggedOverState as any,
              })}
            </span>
          } />
        } />
      } />;
    }
  };
}

export { DragComponent };
export default factory;
