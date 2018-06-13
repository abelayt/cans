import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';

import './style.css';

class AssessmentFormFooter extends Component {
  render() {
    return <Row className={'form-footer'}>
        <Col sm={3}>
          <Button>Cancel</Button>
        </Col>
        <Col sm={3}>
          <Button id={'save-assessment'} disabled={!this.props.assessmentDate} onClick={this.props.handleSaveAssessment}>
            Save
          </Button>
        </Col>
        <Col sm={3}>
          <Button>Submit</Button>
        </Col>
      </Row>;
  }
}

export default AssessmentFormFooter;
