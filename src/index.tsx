import plusnew, {
  store,
  Component,
  ApplicationElement,
  Props,
  Store,
  ComponentContainer,
} from "@plusnew/core";

type position = {
  x: number;
  y: number;
};

type dragState<T> = dragInactive | dragActive<T>;

type dragInactive = {
  active: false;
};

type dragActive<T> = {
  active: true;
} & dragInformation<T>;

type dragInformation<T> = {
  startPosition: position;
  currentPosition: position;
  deltaPosition: position;
  payload: T;
};

type dragProps<T> = {
  onDrop?: (dragState: dragInformation<T>) => void;
  children: (dragState: dragState<T>) => ApplicationElement;
};

type dragStartAction<T> = {
  type: "DRAG_START";
  position: position;
  payload: T;
};

type dragMoveAction = {
  type: "DRAG_MOVE";
  position: position;
};

type dragStopAction = {
  type: "DRAG_STOP";
};

type actions<T> = dragStartAction<T> | dragMoveAction | dragStopAction;

function getDeltaPosition(from: position, to: position) {
  return {
    x: to.x - from.x,
    y: to.y - from.y,
  };
}

export default function <T>(): {
  store: Store<dragState<T>, actions<T>>;
  Component: ComponentContainer<dragProps<T>, any, any>;
} {
  const inactiveDrag: dragState<T> = { active: false };

  const dragStore = store<dragState<T>, actions<T>>(
    inactiveDrag,
    (state, action: actions<T>) => {
      switch (action.type) {
        case "DRAG_START": {
          const result: dragActive<T> = {
            active: true,
            payload: action.payload,
            startPosition: action.position,
            currentPosition: action.position,
            deltaPosition: {
              x: 0,
              y: 0,
            },
          };

          return result;
        }

        case "DRAG_MOVE": {
          if (state.active) {
            const result: dragActive<T> = {
              active: true,
              payload: state.payload,
              startPosition: state.startPosition,
              currentPosition: action.position,
              deltaPosition: getDeltaPosition(
                state.startPosition,
                action.position
              ),
            };

            return result;
          }
          return state;
        }

        case "DRAG_STOP": {
          return inactiveDrag;
        }
        default:
          throw new Error("No Such Action");
      }
    }
  );

  const dropStore = store<dragActive<T> | null, actions<T>>(
    null,
    (previousState, action) => {
      if (action.type === "DRAG_STOP") {
        return mirrorStore.getState() as dragActive<T>;
      }
      return previousState;
    }
  );
  dragStore.subscribe(dropStore.dispatch);

  const mirrorStore = store<dragState<T>>(dragStore.getState());
  dragStore.subscribe(() => mirrorStore.dispatch(dragStore.getState()));

  class DragComponent extends Component<dragProps<T>> {
    render(Props: Props<dragProps<T>>) {
      return (
        <>
          <dropStore.Observer>
            {(dropState) => {
              const currentProps = Props.getState();
              if (dropState !== null && currentProps.onDrop) {
                const { active, ...dragInformation } = dropState;
                currentProps.onDrop(dragInformation);
              }
              return null;
            }}
          </dropStore.Observer>
          <mirrorStore.Observer>
            {(dragState) => (
              <Props>
                {(props) =>
                  ((props.children as any)[0] as dragProps<T>["children"])(
                    dragState
                  )
                }
              </Props>
            )}
          </mirrorStore.Observer>
        </>
      );
    }
  }
  return {
    Component: DragComponent,
    store: dragStore,
  };
}
