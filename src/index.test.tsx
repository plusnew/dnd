import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { Component, Props } from 'plusnew';
import dragFactory, { DragComponent } from './index';
import { componentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test dragFactory', () => {
  it('button should be found', () => {
    type props = {key: number, Drag: DragComponent<number>};
    class MainComponent extends Component<props> {
      render(Props: Props<props>) {
        return <Props render={({ Drag, key }) =>
          <Drag
            { ... ( key % 2 === 0 && { onDragStart: () => key }) }
            render={(dragState) =>
            <>
              <div className="isDraggingActive">{dragState.isDraggingActive.toString()}</div>
              <div className="isDraggedOver">{dragState.isDraggedOver.toString()}</div>
              <div className="target">
                {dragState.isDraggingActive && dragState.target ? dragState.target : 'false'}
              </div>
            </>
          }/>
        } />
      }
    }
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

    wrapper.search(<MainComponentFragment key={0} />).find('span').simulate('dragstart');

    expect(wrapper.search(<MainComponentFragment key={0} />).search(<div className="isDraggingActive">true</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={1} />).search(<div className="isDraggingActive">true</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={2} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);
    expect(wrapper.search(<MainComponentFragment key={3} />).search(<div className="isDraggingActive">false</div>).length).toBe(1);

    
  });
});
