import plusnew, { component, Props, store } from "@plusnew/core";
import enzymeAdapterPlusnew, { mount } from "@plusnew/enzyme-adapter";
import { configure } from "enzyme";
import dndFactory from "./index";

configure({ adapter: new enzymeAdapterPlusnew() });

describe("test dragFactory", () => {
  it("dragState is shown correctly", () => {
    const drag = dndFactory();
    const MainComponent = component("MainComponent", () => (
      <drag.Component>
        {(dragState) => (
          <span>{dragState.active ? "active" : "notactive"}</span>
        )}
      </drag.Component>
    ));

    const wrapper = mount(<MainComponent />);

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_START",
      position: {
        x: 10,
        y: 20,
      },
      payload: {},
    });

    expect(wrapper.containsMatchingElement(<span>active</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_STOP",
    });

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);
  });

  it("dragState carries payload", () => {
    const drag = dndFactory<{ id: number }>();
    const MainComponent = component("MainComponent", () => (
      <drag.Component>
        {(dragState) => (
          <span>{dragState.active ? dragState.payload.id : "notactive"}</span>
        )}
      </drag.Component>
    ));

    const wrapper = mount(<MainComponent />);

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_START",
      position: {
        x: 10,
        y: 20,
      },
      payload: {
        id: 23,
      },
    });

    expect(wrapper.containsMatchingElement(<span>{23}</span>)).toBe(true);
  });

  it("delta position gets carried", () => {
    const onDropSpy = jasmine.createSpy("onDrop");

    const drag = dndFactory<{ id: number }>();
    const MainComponent = component("MainComponent", () => (
      <drag.Component onDrop={onDropSpy}>
        {(dragState) => (
          <span>
            {dragState.active ? dragState.deltaPosition.x : "notactive"}
          </span>
        )}
      </drag.Component>
    ));

    const wrapper = mount(<MainComponent />);

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_START",
      position: {
        x: 10,
        y: 20,
      },
      payload: {
        id: 23,
      },
    });

    expect(wrapper.containsMatchingElement(<span>{0}</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_MOVE",
      position: {
        x: 15,
        y: 25,
      },
    });

    expect(wrapper.containsMatchingElement(<span>{5}</span>)).toBe(true);
    expect(onDropSpy.calls.count()).toBe(0);

    drag.store.dispatch({
      type: "DRAG_STOP",
    });

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);
    expect(onDropSpy.calls.count()).toBe(1);
    expect(onDropSpy).toHaveBeenCalledWith({
      payload: {
        id: 23,
      },
      startPosition: {
        x: 10,
        y: 20,
      },
      currentPosition: {
        x: 15,
        y: 25,
      },
      deltaPosition: {
        x: 5,
        y: 5,
      },
    });
  });

  it("render props just gets called initially, not on inactive state", () => {
    const renderProps = jasmine
      .createSpy("renderProps", (dragState) => (
        <span>{dragState.active ? "active" : "notactive"}</span>
      ))
      .and.callThrough();

    const drag = dndFactory();
    const MainComponent = component("MainComponent", () => (
      <drag.Component>{renderProps}</drag.Component>
    ));

    const wrapper = mount(<MainComponent />);

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);
    expect(renderProps.calls.count()).toBe(1);

    drag.store.dispatch({
      type: "DRAG_MOVE",
      position: {
        x: 15,
        y: 25,
      },
    });

    expect(renderProps.calls.count()).toBe(1);
  });

  it("store throws exception with invalid action", () => {
    const drag = dndFactory();

    expect(() => {
      drag.store.dispatch("no read action" as any);
    }).toThrowError("No Such Action");
  });

  it("all ondrops have to happen before any renderprops", () => {
    const nestedRenderProps = jasmine
      .createSpy("renderProps", (dragState) => (
        <span>{dragState.active ? "active" : "notactive"}</span>
      ))
      .and.callThrough();
    const mainOnDropSpy = jasmine
      .createSpy("mainOnDropSpy", () =>
        expect(nestedRenderProps).not.toHaveBeenCalled()
      )
      .and.callThrough();
    const drag = dndFactory<{ id: number }>();
    const MainComponent = component("MainComponent", () => (
      <drag.Component onDrop={mainOnDropSpy}>
        {(dragState) => (
          <NestedComponent
            id={dragState.active ? dragState.payload.id : null}
          />
        )}
      </drag.Component>
    ));

    const NestedComponent = component(
      "NestedComponent",
      (Props: Props<{ id: number | null }>) => (
        <Props>
          {(props) => (
            <drag.Component onDrop={() => expect(props.id).toBe(23)}>
              {nestedRenderProps}
            </drag.Component>
          )}
        </Props>
      )
    );

    const wrapper = mount(<MainComponent />);

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_START",
      position: {
        x: 10,
        y: 20,
      },
      payload: {
        id: 23,
      },
    });

    expect(wrapper.containsMatchingElement(<span>active</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_MOVE",
      position: {
        x: 15,
        y: 25,
      },
    });

    expect(wrapper.containsMatchingElement(<span>active</span>)).toBe(true);
    nestedRenderProps.calls.reset();

    drag.store.dispatch({
      type: "DRAG_STOP",
    });

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);
    expect(mainOnDropSpy.calls.count()).toBe(1);
  });

  it("no ondrop after reconstruct component", () => {
    const local = store(true);
    const onDropSpy = jasmine.createSpy("onDropSpy");

    const drag = dndFactory();
    const MainComponent = component("MainComponent", () => (
      <local.Observer>
        {(localState) => (
          <drag.Component key={localState ? "foo" : "bar"} onDrop={onDropSpy}>
            {(dragState) => (
              <span>{dragState.active ? "active" : "notactive"}</span>
            )}
          </drag.Component>
        )}
      </local.Observer>
    ));

    const wrapper = mount(<MainComponent />);

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_START",
      position: {
        x: 10,
        y: 20,
      },
      payload: {},
    });

    expect(wrapper.containsMatchingElement(<span>active</span>)).toBe(true);

    drag.store.dispatch({
      type: "DRAG_STOP",
    });

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);
    expect(onDropSpy).toHaveBeenCalledTimes(1);

    local.dispatch(false);

    expect(wrapper.containsMatchingElement(<span>notactive</span>)).toBe(true);
    expect(onDropSpy).toHaveBeenCalledTimes(1);
  });
});
