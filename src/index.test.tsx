import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { Component, Props, store } from 'plusnew';
import dragFactory, { DragComponent } from './index';
import { componentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

function nextTick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}

type props = {key: number, Drag: DragComponent<number>};

class MainComponent extends Component<props> {
  render(Props: Props<props>) {
    const recieve = store(false as boolean | number, (_state, action: number) => action);

    return <Props>{({ Drag, key }) =>
      <recieve.Observer>{recieveState =>
        <Drag
          { ... ( key % 2 === 0 && { onDragStart: () => key }) }
          onDrop={(source) => recieve.dispatch(source)}
          render={(dragState) =>
            <>
              <span className="isDraggingActive">{dragState.isDraggingActive.toString()}</span>
              <span className="isDraggedOver">{dragState.isDraggedOver.toString()}</span>
              <span className="source">
                {dragState.isDraggingActive ? dragState.source.toString() : 'false'}
              </span>
              <span className="recieve">{recieveState.toString()}</span>
            </>
          }
        />
      }</recieve.Observer>
    }</Props>
  }
}

describe('test dragFactory', () => {
  it('isDraggingActive handling is correct', async () => {
    const Drag = dragFactory<number>();
    const AnotherDrag = dragFactory<number>();

    const wrapper = mount(<>
      <MainComponent key={0} Drag={Drag}/>
      <MainComponent key={1} Drag={Drag}/>
      <MainComponent key={2} Drag={AnotherDrag}/>
      <MainComponent key={3} Drag={AnotherDrag}/>
    </>);

    expect(wrapper.search(<span className="isDraggingActive">false</span>).length).toBe(4);
    expect(wrapper.search(<span className="isDraggedOver">false</span>).length).toBe(4);
    expect(wrapper.search(<span className="source">false</span>).length).toBe(4);

    const MainComponentFragment = componentPartial(MainComponent);
    expect(wrapper.search(<MainComponentFragment key={0} />).find('div').prop('draggable')).toBe("true");
    expect(wrapper.search(<MainComponentFragment key={1} />).find('div').prop('draggable')).toBe(undefined);

    expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);

    wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragstart');
    await nextTick();

    expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggingActive">true</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggingActive">true</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);

    wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragend');

    expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggingActive">false</span>).length).toBe(1);

    wrapper.unmount();
  });

  describe('isDraggedOver handling is correct', () => {
    it('on same element', async () => {

      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<span className="isDraggingActive">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="isDraggedOver">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="source">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="recieve">false</span>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('div').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('div').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragstart');
      await nextTick();

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      // Dragenter on the same group
      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragenter');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">true</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragleave');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      wrapper.unmount();
    });

    it('on same group', async () => {
      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<span className="isDraggingActive">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="isDraggedOver">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="source">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="recieve">false</span>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('div').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('div').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragstart');
      await nextTick();

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      // Dragenter on the same group
      wrapper.search(<MainComponentFragment key={1} />).find('div').simulate('dragenter');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">true</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={1} />).find('div').simulate('dragleave');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      wrapper.unmount();
    });


    it('on different group', async () => {
      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<span className="isDraggingActive">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="isDraggedOver">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="source">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="recieve">false</span>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('div').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('div').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragstart');
      await nextTick();

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      // Dragenter on the same group
      wrapper.search(<MainComponentFragment key={2} />).find('div').simulate('dragenter');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="isDraggedOver">false</span>).length).toBe(1);

      wrapper.unmount();
    });
  });

  describe('dragEnd handling is correct', () => {
    it('on same element', async () => {

      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<span className="isDraggingActive">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="isDraggedOver">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="source">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="recieve">false</span>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('div').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('div').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragstart');
      await nextTick();

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      // dragend on the same group
      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('drop');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">0</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      wrapper.unmount();
    });

    it('on same group', async () => {
      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<span className="isDraggingActive">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="isDraggedOver">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="source">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="recieve">false</span>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('div').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('div').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragstart');
      await nextTick();

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      // dragend on the same group
      wrapper.search(<MainComponentFragment key={1} />).find('div').simulate('drop');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">0</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      wrapper.unmount();
    });


    it('on different group', async () => {
      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<span className="isDraggingActive">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="isDraggedOver">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="source">false</span>).length).toBe(4);
      expect(wrapper.search(<span className="recieve">false</span>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('div').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('div').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('div').simulate('dragstart');
      await nextTick();

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      // dragend on the same group
      wrapper.search(<MainComponentFragment key={2} />).find('div').simulate('drop');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<span className="recieve">false</span>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<span className="recieve">false</span>).length).toBe(1);

      wrapper.unmount();
    });
  });
});
