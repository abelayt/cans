import React, { Component, Fragment } from 'react';
// import { Row, Col} from 'reactstrap';
import Row from '@cwds/components/lib/Row';
import Col from '@cwds/components/lib/Col';
import PropTypes from 'prop-types'

import '../../style.css';

class PageInfo extends Component {

  static propTypes = {
    // page header title
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Col xs="12">
            <div className={'title'}>{this.props.title}</div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default PageInfo;
