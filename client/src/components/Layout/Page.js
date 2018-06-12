import React, { Component } from 'react';
import Container from '@cwds/components/lib/Container';
import Row from '@cwds/components/lib/Row';
import Col from '@cwds/components/lib/Col';
import { PageInfo, SideNav } from './';
import { Routes } from '../../routes';

class Page extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col xs="4"><SideNav /></Col>
          <Col xs='8'>
            <Row>
              <Col xs="12"><Routes /></Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Page
