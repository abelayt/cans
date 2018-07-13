import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Assessment, AssessmentFormHeader, AssessmentFormFooter, AssessmentService, I18nService } from './';
import Typography from '@material-ui/core/Typography';
import { clone } from 'lodash';
import { PageInfo } from '../Layout';
import { PersonService } from '../Client/';
import { LoadingState } from '../../util/loadingHelper';
import {
  AssessmentStatus,
  AssessmentType,
  validateAssessmentForSubmit,
  defaultEmptyAssessment,
} from './AssessmentHelper';
import { DateTime } from 'luxon';

/* eslint-disable camelcase */
class AssessmentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment: defaultEmptyAssessment,
      assessment_status: LoadingState.idle,
      i18n: {},
      i18n_status: LoadingState.idle,
      child: {},
      isValidForSubmit: false,
      redirection: {
        shouldRedirect: false,
        successAssessmentId: null,
      },
    };
  }

  componentDidMount() {
    const assessmentId = this.props.match.params.id;
    PersonService.fetch(this.props.match.params.childId)
      .then(response => this.setState({ child: response }))
      .catch(() => this.setState({ child: {} }));
    assessmentId ? this.fetchAssessment(assessmentId) : this.fetchNewAssessment();
  }

  fetchNewAssessment() {
    this.setState({ assessment_status: LoadingState.waiting });
    return AssessmentService.fetchNewAssessment()
      .then(this.onFetchNewAssessmentSuccess)
      .catch(() => this.setState({ assessment_status: LoadingState.error }));
  }

  onFetchNewAssessmentSuccess = instrument => {
    const assessment = {
      instrument_id: 1,
      person: this.state.child,
      assessment_type: AssessmentType.initial,
      status: AssessmentStatus.inProgress,
      state: instrument.prototype,
      event_date: DateTime.local().toISODate(),
      completed_as: 'COMMUNIMETRIC',
      can_release_confidential_info: false,
    };
    this.setState({
      assessment,
      assessment_status: LoadingState.ready,
    });
    this.fetchI18n(assessment.instrument_id);
  };

  fetchAssessment(id) {
    this.setState({ assessment_status: LoadingState.waiting });
    return AssessmentService.fetch(id)
      .then(this.onFetchAssessmentSuccess)
      .catch(() => this.setState({ assessment_status: LoadingState.error }));
  }

  onFetchAssessmentSuccess = assessment => {
    this.updateAssessment(assessment);
    this.fetchI18n(assessment.instrument_id);
  };

  fetchI18n(instrumentId) {
    this.setState({ i18n_status: LoadingState.waiting });
    return I18nService.fetchByInstrumentId(instrumentId)
      .then(this.onFetchI18nSuccess)
      .catch(() => this.setState({ i18n_status: LoadingState.error }));
  }

  onFetchI18nSuccess = i18n => {
    this.setState({
      i18n: i18n,
      i18n_status: LoadingState.ready,
    });
  };

  updateAssessment = assessment => {
    const isValidForSubmit = validateAssessmentForSubmit(assessment);
    this.setState({
      assessment,
      assessment_status: LoadingState.ready,
      isValidForSubmit,
    });
  };

  initialSave(assessment) {
    this.setState({ assessment });
    this.updateUrlWithAssessment(assessment);
  }

  updateUrlWithAssessment(assessment) {
    this.props.history.push(`/clients/${this.state.child.id}/assessments/${assessment.id}`);
  }

  handleSaveAssessment = () => {
    const assessment = this.state.assessment;
    assessment.person = this.state.child;
    if (assessment.id) {
      AssessmentService.update(assessment.id, assessment)
        .then(updatedAssessment => {
          this.setState({ assessment: updatedAssessment });
        })
        .catch(() => this.setState({ assessment_status: LoadingState.error }));
    } else {
      AssessmentService.postAssessment(assessment)
        .then(updatedAssessment => {
          this.initialSave(updatedAssessment);
        })
        .catch(() => this.setState({ assessment_status: LoadingState.error }));
    }
  };

  handleSubmitAssessment = () => {
    const assessment = clone(this.state.assessment);
    assessment.status = AssessmentStatus.submitted;
    assessment.person = this.state.child;
    if (assessment.id) {
      AssessmentService.update(assessment.id, assessment)
        .then(submittedAssessment => {
          this.setState({
            redirection: {
              shouldRedirect: true,
              successAssessmentId: submittedAssessment.id,
            },
          });
        })
        .catch(() => this.setState({ assessment_status: LoadingState.error }));
    } else {
      AssessmentService.postAssessment(assessment)
        .then(submittedAssessment => {
          this.updateUrlWithAssessment(submittedAssessment);
          this.setState({
            redirection: {
              shouldRedirect: true,
              successAssessmentId: submittedAssessment.id,
            },
          });
        })
        .catch(() => this.setState({ assessment_status: LoadingState.error }));
    }
  };

  handleCancelClick = () => {
    this.setState({
      redirection: {
        shouldRedirect: true,
      },
    });
  };

  render() {
    const { child, redirection, isValidForSubmit, assessment, i18n } = this.state;
    const { shouldRedirect, successAssessmentId } = redirection;
    if (shouldRedirect) {
      return <Redirect push to={{ pathname: `/clients/${child.id}`, state: { successAssessmentId } }} />;
    }
    return (
      <Fragment>
        <PageInfo title={'Add CANS'} />
        <AssessmentFormHeader client={child} assessment={assessment} onAssessmentUpdate={this.updateAssessment} />
        <Assessment assessment={assessment} i18n={i18n} onAssessmentUpdate={this.updateAssessment} />
        <Typography variant="headline" className={'submit-validation-message'}>
          Assessment Date, Complete as, and all available ratings fields for the child/adolescent and applicable
          caregiver(s) must be completed prior to clicking the Submit button.
        </Typography>
        <AssessmentFormFooter
          onCancelClick={this.handleCancelClick}
          saveButtonEnabled={!!this.state.assessment.event_date}
          onSaveAssessment={this.handleSaveAssessment}
          submitButtonEnabled={isValidForSubmit}
          onSubmitAssessment={this.handleSubmitAssessment}
        />
      </Fragment>
    );
  }
}
/* eslint-enable camelcase */

AssessmentContainer.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

AssessmentContainer.defaultProps = {
  match: {},
  history: {},
};

export default AssessmentContainer;
