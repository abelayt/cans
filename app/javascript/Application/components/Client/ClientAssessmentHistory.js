import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { AssessmentService } from '../Assessment/Assessment.service';
import { CloseableAlert, alertType } from '../common/CloseableAlert';
import { toDateFormat } from '../../util/formatters';

import './style.sass';

const getActionVerbByStatus = status => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'Saved';
    case 'SUBMITTED':
      return 'Submitted';
    default:
      return 'Updated';
  }
};

/* eslint-disable camelcase */
class ClientAssessmentHistory extends Component {
  constructor(context) {
    super(context);
    const { successAssessmentId } = (this.props.location || {}).state || {};
    if (successAssessmentId && this.props.history) {
      this.props.history.replace({ ...this.props.location, state: {} });
    }
    this.state = {
      clientId: null,
      assessments: [],
      fetchStatus: 'idle',
      shouldRenderSuccessMessage: !!successAssessmentId,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { clientId } = nextProps;
    if (clientId) {
      this.setState({ clientId });
      this.searchAssessments(clientId);
    }
  }

  searchAssessments(clientId) {
    return AssessmentService.search({ person_id: clientId }).then(data => {
      this.setState({
        assessments: data,
        fetchStatus: 'ready',
      });
    });
  }

  renderAddCansButton() {
    const childId = this.props.clientId;
    return (
      <Link
        to={{
          pathname: `/clients/${childId}/assessments`,
        }}
      >
        <Button size="small" color="inherit" className={'card-header-cans-button'}>
          Add Cans
        </Button>
      </Link>
    );
  }

  renderLock(status) {
    switch (status) {
      case 'IN_PROGRESS':
        return <i className="fa fa-unlock-alt fa-3x unlocked-icon" aria-hidden="true" />;
      case 'SUBMITTED':
        return <i className="fa fa-lock fa-3x locked-icon" aria-hidden="true" />;
      default:
        return null;
    }
  }

  renderAssessments = (assessments, fetchStatus) => {
    if (fetchStatus === 'ready' && assessments.length === 0) {
      return <div id="no-data">No assessments currently exist for this child/youth.</div>;
    }

    return assessments.map(assessment => {
      const { id, event_date, status, person } = assessment;
      const { updated_timestamp, updated_by, created_timestamp, created_by } = assessment;
      const formattedEventDate = toDateFormat(event_date);
      const actionVerb = getActionVerbByStatus(status);
      const timestamp = updated_timestamp || created_timestamp;
      const formattedTimestamp = toDateFormat(timestamp);
      const user = updated_by || created_by || {};
      const updatedByName = `${user.first_name} ${user.last_name}`;
      return (
        <Container key={id} className={'history-item'}>
          <Row>
            <Col xs="1">{this.renderLock(status)}</Col>
            <Col xs="11">
              <Row>
                <Col xs="12">
                  <Link to={{ pathname: `${person.id}/assessments/${id}` }} className={'underlined'}>
                    {`${formattedEventDate} CANS`}
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <Typography variant={'headline'} color={'textSecondary'} className={'item-timestamp'}>
                    {`${actionVerb} on ${formattedTimestamp} by ${updatedByName}`}
                  </Typography>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      );
    });
  };

  render() {
    const { assessments, fetchStatus, shouldRenderSuccessMessage } = this.state;
    return (
      <Grid item xs={12}>
        <Card className={'card'}>
          <CardHeader className={'card-header-cans'} title="Assessment History" action={this.renderAddCansButton()} />

          <div className={'content'}>
            <CardContent>
              {shouldRenderSuccessMessage && (
                <CloseableAlert
                  type={alertType.SUCCESS}
                  message={'Success! CANS assessment has been submitted.'}
                  isCloseable
                  isAutoCloseable
                />
              )}
              {this.renderAssessments(assessments, fetchStatus)}
            </CardContent>
          </div>
        </Card>
      </Grid>
    );
  }
}
/* eslint-enable camelcase */

ClientAssessmentHistory.propTypes = {
  clientId: PropTypes.number,
  location: PropTypes.object,
  history: PropTypes.object,
};

export default ClientAssessmentHistory;
