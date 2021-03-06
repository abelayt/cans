import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { SideNav } from './';
import { Routes } from '../../routes';

const Page = () => {
  return (
    <Container>
      <Row>
        <Col xs="4">
          <SideNav />
        </Col>
        <Col xs="8">
          <Row>
            <Col xs="12">
              <Routes />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
