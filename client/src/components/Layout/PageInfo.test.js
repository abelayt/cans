import React from 'react';
import { shallow } from 'enzyme';
// import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Row from '@cwds/components/lib/Row';
import Col from '@cwds/components/lib/Col';
import PageInfo from './PageInfo';

describe('<PageInfo />', () => {
  const getWrapper = () => shallow(<PageInfo title={'title'}/>);
  const getLength = component => getWrapper().find(component).length;

  it('renders with 1 <Row /> component', () => {
    expect(getLength(Row)).toBe(1);
  });

  it('renders with 1 <Col /> component', () => {
    expect(getLength(Col)).toBe(1);
  });

});
