import { ComponentContainer } from 'plusnew';

export function componentPartial<P>(component: ComponentContainer<P>) {
  const componentpartial = component as ComponentContainer<Partial<P>>;
  return componentpartial;
}