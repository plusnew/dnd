import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { Component, Props, store } from 'plusnew';
import dragFactory, { DragComponent } from './index';
import { componentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

type props = {key: number, Drag: DragComponent<number>};

class MainComponent extends Component<props> {
  render(Props: Props<props>) {
    const recieve = store(false as boolean | number, (_state, action: number) => action);

    return <Props render={({ Drag, key }) =>
      <recieve.Observer render={recieveState =>
        <Drag
          { ... ( key % 2 === 0 && { onDragStart: () => key }) }
          onDragEnd={(target) => recieve.dispatch(target)}
          render={(dragState) =>
            <>
              <div className="isDraggingActive">{dragState.isDraggingActive.toString()}</div>
              <div className="isDraggedOver">{dragState.isDraggedOver.toString()}</div>
              <div className="target">
                {dragState.isDraggingActive ? dragState.target.toString() : 'false'}
              </div>
              <div className="recieve">{recieveState.toString()}</div>
            </>
          }
        />
      } />
    } />
  }
}

describe('test dragFactory', () => {
  it('isDraggingActive handling is correct', () => {
    const Drag = dragFactory<number>();
    const AnotherDrag = dragFactory<number>();

    const wrapper = mount(<>
      <MainComponent key={0} Drag={Drag}/>
      <MainComponent key={1} Drag={Drag}/>
      <MainComponent key={2} Drag={AnotherDrag}/>
      <MainComponent key={3} Drag={AnotherDrag}/>
    </>);

    expect(wrapper.search(<div className="isDraggingActive">false</div>).length).toBe(4);
    expect(wrapper.search(<div className="isDraggedOver">false</div>).length).toBe(4);
    expect(wrapper.search(<div className="target">false</div>).length).toBe(4);

    const MainComponentFragment = componentPartial(MainComponent);
    expect(wrapper.search(<MainComponentFragment key={0} />).find('span').prop('draggable')).toBe("true");
    expect(wrapper.search(<MainComponentFragment key={1} />).find('span').prop('draggable')).toBe(undefined);

    expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);

    wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragstart');

    expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggingActive">true</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggingActive">true</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);

    window.dispatchEvent(new Event('dragend', { bubbles: true, cancelable: true }));

    expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);

    wrapper.unmount();
  });

  describe('isDraggedOver handling is correct', () => {
    it('on same element', () => {

      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<div className="isDraggingActive">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="isDraggedOver">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="target">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="recieve">false</div>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('span').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('span').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragstart');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      // Dragenter on the same group
      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragenter');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">true</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragleave');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      wrapper.unmount();
    });

    it('on same group', () => {
      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<div className="isDraggingActive">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="isDraggedOver">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="target">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="recieve">false</div>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('span').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('span').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragstart');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      // Dragenter on the same group
      wrapper.search(<MainComponentFragment key={1} />).find('span').simulate('dragenter');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">true</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={1} />).find('span').simulate('dragleave');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      wrapper.unmount();
    });


    it('on different group', () => {
      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<div className="isDraggingActive">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="isDraggedOver">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="target">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="recieve">false</div>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('span').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('span').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragstart');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      // Dragenter on the same group
      wrapper.search(<MainComponentFragment key={2} />).find('span').simulate('dragenter');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggedOver">false</div>).length).toBe(1);

      wrapper.unmount();
    });
  });

  describe('dragEnd handling is correct', () => {
    it('on same element', () => {

      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<div className="isDraggingActive">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="isDraggedOver">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="target">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="recieve">false</div>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('span').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('span').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragstart');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      // dragend on the same group
      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragend');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">0</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      wrapper.unmount();
    });

    it('on same group', () => {
      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<div className="isDraggingActive">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="isDraggedOver">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="target">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="recieve">false</div>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('span').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('span').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragstart');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      // dragend on the same group
      wrapper.search(<MainComponentFragment key={1} />).find('span').simulate('dragend');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">0</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      wrapper.unmount();
    });


    it('on different group', () => {
      const Drag = dragFactory<number>();
      const AnotherDrag = dragFactory<number>();

      const wrapper = mount(<>
        <MainComponent key={0} Drag={Drag}/>
        <MainComponent key={1} Drag={Drag}/>
        <MainComponent key={2} Drag={AnotherDrag}/>
        <MainComponent key={3} Drag={AnotherDrag}/>
      </>);

      expect(wrapper.search(<div className="isDraggingActive">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="isDraggedOver">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="target">false</div>).length).toBe(4);
      expect(wrapper.search(<div className="recieve">false</div>).length).toBe(4);

      const MainComponentFragment = componentPartial(MainComponent);
      expect(wrapper.search(<MainComponentFragment key={0} />).find('span').prop('draggable')).toBe("true");
      expect(wrapper.search(<MainComponentFragment key={1} />).find('span').prop('draggable')).toBe(undefined);

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragstart');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      // dragend on the same group
      wrapper.search(<MainComponentFragment key={2} />).find('span').simulate('dragend');

      expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="recieve">false</div>).length).toBe(1);
      expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="recieve">false</div>).length).toBe(1);

      wrapper.unmount();
    });
  });
});
