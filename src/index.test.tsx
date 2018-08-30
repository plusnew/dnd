import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { Component, Props } from 'plusnew';
import dragFactory, { DragComponent } from './index';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test dragFactory', () => {
  it('button should be found', () => {
    type props = {key: number, Drag: DragComponent<number>};
    class MainComponent extends Component<props> {
      render(Props: Props<props>) {
        return <Props render={({ Drag, key }) =>
          <Drag render={(dragState) =>
            <>
              <div className="isDraggingActive">{dragState.isDraggingActive.toString()}</div>
              <div className="isDraggedOver">{dragState.isDraggedOver.toString()}</div>
              {dragState.isDraggingActive && dragState.target && <div className="target">{dragState.target}</div>}
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

    // console.log(wrapper.debug());
  });
});
