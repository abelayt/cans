import React, { Component, Fragment } from 'react';
import {
  AssessmentFormHeader,
  Domain,
  DomainsGroup,
  AssessmentService,
  I18nService,
} from './';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { getI18nByCode } from './I18nHelper';
import { clone } from 'lodash';
import AssessmentFormFooter from './AssessmentFormFooter';
import { PageInfo } from '../Layout';
import { PersonService } from '../Client/';
import { LoadingState } from '../../util/loadingHelper';
import { AssessmentStatus, AssessmentType } from './AssessmentHelper';
import { DateTime } from 'luxon';

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment: {},
      assessment_status: LoadingState.idle,
      i18n: {},
      i18n_status: LoadingState.idle,
      child: {},
    };
  }

  componentDidMount() {
    const assessmentId = this.props.match.params.id;
    PersonService.fetch(this.props.match.params.childId)
      .then(response => this.setState({ child: response }))
      .catch(() => this.setState({ child: {} }));
    assessmentId
      ? this.fetchAssessment(assessmentId)
      : this.fetchNewAssessment();
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
    this.setState({
      assessment,
      assessment_status: LoadingState.ready,
    });
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

  handleUpdateItemRating = (code, rating) => {
    this.updateAndStoreItem(code, 'rating', rating);
  };

  handleUpdateItemConfidentiality = (code, isConfidential) => {
    this.updateAndStoreItem(code, 'confidential', isConfidential);
  };

  handleDateChange = (dateValue) => {
    const assessment = this.state.assessment;
    assessment.event_date = dateValue;
    this.updateAssessment(assessment)
  };

  handleSelectCompletedAs = (completedAs) => {
    const assessment = this.state.assessment;
    assessment.completed_as = completedAs;
    this.updateAssessment(assessment)
  };

  updateAndStoreItem = (itemCode, key, value) => {
    const updateAssessment = clone(this.state.assessment);
    updateAssessment.state.domains.map(assessmentChild => {
      if (assessmentChild.class === 'domain') {
        assessmentChild.items.map(item => {
          if (item.code === itemCode) {
            item[key] = value;
          }
        });
      } else {
        assessmentChild.domains.map(domain => {
          domain.items.map(item => {
            if (item.code === itemCode) {
              item[key] = value;
            }
          });
        });
      }
    });
    this.updateAssessment(updateAssessment);
  };

  updateAssessment(assessment) {
    this.setState({
      assessment,
      assessment_status: LoadingState.ready,
    });
  }

  initialSave(assessment) {
    this.setState({ assessment });
    this.updateUrlWithAssessment(assessment)
  }

  updateUrlWithAssessment(assessment) {
    this.props.history.push(`/clients/${this.state.child.id}/assessments/${assessment.id}`);
  }

  handleSaveAssessment = () => {
    const assessment = this.state.assessment;
    if (assessment.id) {
      AssessmentService.update(assessment.id, assessment)
        .then((updatedAssessment) => {this.setState({ assessment: updatedAssessment })})
        .catch(() => this.setState({ assessment_status: LoadingState.error }));
    } else {
      AssessmentService.postAssessment(assessment)
        .then((updatedAssessment) => {this.initialSave(updatedAssessment)})
        .catch(() => this.setState({ assessment_status: LoadingState.error }));
    }
  };

  toggleUnderSix = () => {
    const assessment = this.state.assessment;
    assessment.state.under_six = !assessment.state.under_six;
    this.setState({ assessment });
  };

  renderDomains(domains) {
    const i18n = this.state.i18n || {};
    const { under_six } = (this.state.assessment || {}).state || {};
    return domains.map(domain => {
      const domainCode = domain.code;
      const domainI18n = getI18nByCode(i18n, domainCode);
      return domain.class === 'domain' ? (
        <Domain
          key={domainCode}
          domain={domain}
          i18n={domainI18n}
          i18nAll={i18n}
          assessmentUnderSix={under_six}
          onRatingUpdate={this.handleUpdateItemRating}
          onConfidentialityUpdate={this.handleUpdateItemConfidentiality}
        />
      ) : (
        <DomainsGroup
          key={domainCode}
          domainsGroup={domain}
          i18n={domainI18n}
          i18nAll={i18n}
          assessmentUnderSix={under_six}
          onRatingUpdate={this.handleUpdateItemRating}
          onConfidentialityUpdate={this.handleUpdateItemConfidentiality}
        />
      );
    });
  }

  render() {
    const child = this.state.child;
    const assessmentState = this.state.assessment.state || {};
    const isUnderSix = assessmentState.under_six || false;
    const domains = assessmentState.domains || [];
    return (
      <Fragment>
        <PageInfo title={'Add CANS'} />
        <AssessmentFormHeader
          clientFirstName={child.first_name}
          clientLastName={child.last_name}
          onAssessmentDateChange={this.handleDateChange}
          onAssessmentCompletedAsChange={this.handleSelectCompletedAs}
          assessmentDate={this.state.assessment.event_date}
          assessmentCompletedAs={this.state.assessment.completed_as}
        />
        <Typography variant="body1" style={{ textAlign: 'right' }}>
          Age: 0-5
          <FormControlLabel
            control={
              <Switch
                checked={!isUnderSix}
                value={isUnderSix}
                onChange={this.toggleUnderSix}
                color="default"
              />
            }
            label="6-21"
            style={{ marginLeft: '0px' }}
          />
        </Typography>
        {this.renderDomains(domains)}
        <AssessmentFormFooter handleSaveAssessment={this.handleSaveAssessment}
                              assessmentDate={this.state.assessment.event_date}/>
      </Fragment>
    );
  };
}

export default Assessment;
