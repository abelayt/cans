import React from 'react';
import { shallow } from 'enzyme';
import { Client } from './index';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { PageInfo } from '../Layout';
import { MemoryRouter } from 'react-router-dom';

describe('<Client />', () => {
  describe('initial component layout', () => {
    const match = { params: { id: 1 } };
    const getWrapper = () => shallow(<Client match={match} />);
    const getLength = component => getWrapper().find(component).length;

    it('renders with 1 <Card /> component', () => {
      expect(getLength(Card)).toBe(1);
    });

    it('renders with 1 <CardHeader /> component', () => {
      expect(getLength(CardHeader)).toBe(1);
    });

    it('renders with <CardContent /> component', () => {
      expect(getLength(CardContent)).toBe(1);
    });

    it('renders with <PageInfo /> component', () => {
      expect(getLength(PageInfo)).toBe(1);
    });
  });

  describe('with no childData', () => {
    const match = { params: { id: 1 } };
    const getWrapper = () => shallow(<Client match={match} />);
    const getLength = component => getWrapper().find(component).length;

    it('renders with 2 <Grid /> components', () => {
      expect(getLength(Grid)).toBe(2);
    });

    it('renders No Child Data Found', () => {
      expect(getLength('#no-data')).toBe(1);
    });
  });

  describe('with childData', () => {
    const match = { params: { id: 1 } };
    let wrapper = {};
    beforeEach(() => {
      wrapper = shallow(
        <MemoryRouter>
          <Client match={match} />
        </MemoryRouter>
      )
        .find(Client)
        .dive();

      wrapper.setState({
        childData: {
          id: 1,
          first_name: 'test',
          middle_name: 'name',
          last_name: 'user',
          suffix: 'Mr.',
          dob: '10/10/1980',
          external_id: '1234567891234567890',
          county: { name: 'Sacramento' },
          cases: [],
        },
      });
    });

    const getLength = component => wrapper.find(component).length;

    it('renders with 9 <Grid /> components', () => {
      expect(getLength(Grid)).toBe(12);
    });

    it('renders with 6 <Typography /> components', () => {
      expect(getLength(Typography)).toBe(9);
    });

    it('does not render No Child Data Found', () => {
      expect(getLength('#no-data')).not.toBe(1);
    });
  });

  describe('componentDidMount', () => {
    const match = { params: { id: 1 } };

    it('calls fetchChildData', () => {
      const spy = jest.spyOn(Client.prototype, 'componentDidMount');
      const fetchClientDataSpy = jest.spyOn(Client.prototype, 'fetchChildData');
      const wrapper = shallow(<Client match={match} />);
      wrapper.instance().componentDidMount();
      expect(spy).toHaveBeenCalledWith();
      expect(fetchClientDataSpy).toHaveBeenCalledWith(1);

      spy.mockReset();
      fetchClientDataSpy.mockReset();
    });
  });
});
