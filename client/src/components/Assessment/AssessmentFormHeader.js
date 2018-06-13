import React, { Component, Fragment } from 'react';
import { Row, Col, Label, Input } from 'reactstrap';

import './style.css';
import PropTypes from 'prop-types';

class AssessmentFormHeader extends Component {
  static propTypes = {
    onAssessmentDateChange: PropTypes.func.isRequired,
    onAssessmentCompletedAsChange: PropTypes.func.isRequired,
    assessmentDate: PropTypes.string.isRequired,
    assessmentCompletedAs: PropTypes.string.isRequired,
  };

  handleDateChange = (event) => {
    this.props.onAssessmentDateChange(event.target.value)
  };

  handleSelectCompletedAs = (event) => {
    this.props.onAssessmentCompletedAsChange(event.target.value)
  };

  renderClientName() {
    const { clientFirstName, clientLastName } = this.props;
    return (
      <Fragment>
        {clientFirstName && clientLastName ? (
          <Col sm={12}>
            <span id={'child-name'}>
              {clientLastName + ', ' + clientFirstName}
            </span>
          </Col>
        ) : (
          <Col sm={12}>
            <span id={'no-data'}>Client Info</span>
          </Col>
        )}
      </Fragment>
    );
  }

  render() {
    return <Fragment>
      <Row>{this.renderClientName()}</Row>
      <Row className={'assessment-form-header-inputs'}>
        <Col sm={4}>
          <Label for="date-select">Date</Label>
          <Input
            type={'date'}
            id="date-select"
            value={this.props.assessmentDate}
            onChange={this.handleDateChange}
          />
        </Col>
        <Col sm={4}>
          <Label for="select-user">Complete as</Label>
          <Input
            type="select"
            name="select"
            id="select-user"
            value={this.props.assessmentCompletedAs}
            onChange={this.handleSelectCompletedAs}
          >
            <option value={'COMMUNIMETRIC'}>Communimetric</option>
          </Input>

        </Col>
      </Row>
    </Fragment>;
  }
}

export default AssessmentFormHeader;
