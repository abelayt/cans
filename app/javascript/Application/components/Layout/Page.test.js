import React from 'react';
import { shallow } from 'enzyme';
import { Page, SideNav } from './';
import { Routes } from '../../routes';

describe('<Page />', () => {
  describe('layout', () => {
    const getWrapper = () => shallow(<Page />);

    it('renders with <SideNav /> links', () => {
      const wrapper = getWrapper();
      const sideNav = wrapper.find(SideNav);

      expect(sideNav.length).toBe(1);
      expect(sideNav.dive().find({ text: 'Reports' }).length).toBe(1);
    });

    it('renders with <Routes /> component', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(Routes).length).toBe(1);
    });
  });
});
