import plusnew, { Component, ApplicationElement, ComponentContainer, Props, store } from 'plusnew';

type isNotDragging = {
  isDraggingActive: false;
  isDraggedOver: false;
};

type isDragging<target> = {
  isDraggingActive: true;
  isDraggedOver: boolean;
  target: target;
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
    render(Props: Props<DragProps<target>>) {
      return <Props render={({ onDragStart, render }) =>
        <span
          { ...(onDragStart !== undefined && {
            draggable: 'true',
            ondragstart: () => dragStore.dispatch({ isDraggingActive: true, target: onDragStart()})
          })}
        >
          <dragStore.Observer render={(dragState) =>
            render({
              ...dragState,
              isDraggedOver: false,
            })
          } />
        </span>
      } />;
    }
  };
}

export { DragComponent };
export default factory;
