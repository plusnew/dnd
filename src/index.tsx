import plusnew, { Component, ApplicationElement, ComponentContainer, Props, store } from 'plusnew';

type isNotDragging = {
  isDraggingActive: false;
  isDraggedOver: false;
};

type isDragging<source> = {
  isDraggingActive: true;
  source: source;
  isDraggedOver: boolean;
};

export type dragState<source> = isDragging<source> | isNotDragging;

type DragProps<source> = {
  onDragStart?: (element: HTMLElement) => source;
  onDrop?: (source: source) => void;
  render: (drag: dragState<source>) => ApplicationElement;
};

type DragComponent<source> = ComponentContainer<DragProps<source>>;

function factory<source>() {
  type dragState = { isDraggingActive: false } | { isDraggingActive: true, source: source };

  const dragStore = store({ isDraggingActive: false } as dragState, (_state, action: dragState) => action);

  return class Drag extends Component<DragProps<source>> {
    displayName = 'Drag';
    counter = 0;
    draggedOver = store(false, (_state, action: boolean) => {
      return action;
    });

    dragEnd() {
      this.counter = 0;
      this.draggedOver.dispatch(false);
      dragStore.dispatch({ isDraggingActive: false });
    }

    render(Props: Props<DragProps<source>>) {

      return <Props render={({ onDragStart, onDrop, render }) =>
        <this.draggedOver.Observer render={draggedOverState =>
          <dragStore.Observer render={dragState =>
            <div
              {...(onDragStart !== undefined && {
                draggable: 'true',
                ondragstart: (evt: DragEvent) => setImmediate(() =>
                  dragStore.dispatch({ isDraggingActive: true, source: onDragStart(evt.target as HTMLElement) }),
                ),
              })}
              ondragover={(event: DragEvent) => dragState.isDraggingActive === true && event.preventDefault()}
              ondragenter={() => {
                if (dragState.isDraggingActive === true) {
                  this.counter += 1;
                  this.draggedOver.dispatch(true);
                }
              }}
              ondragend={() => {
                if (dragState.isDraggingActive === true) {
                  this.dragEnd();
                }
              }}
              ondragleave={() => {
                if (dragState.isDraggingActive === true) {
                  this.counter -= 1;
                  if (this.counter === 0) {
                    this.draggedOver.dispatch(false);
                  }
                }
              }}
              ondrop={(event: DragEvent) => {
                if (dragState.isDraggingActive === true && onDrop) {
                  event.preventDefault();
                  onDrop(dragState.source);
                  this.dragEnd();
                }
              }}
            >
              {render({
                ...dragState,
                ... (dragState.isDraggingActive === true && { source: dragState.source }),
                isDraggedOver: draggedOverState as any,
              })}
            </div>
          } />
        } />
      } />;
    }
  };
}

export { DragComponent };
export default factory;
