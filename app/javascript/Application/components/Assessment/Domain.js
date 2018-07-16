import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Input } from 'reactstrap';
import { Item } from './';
import { getI18nByCode } from './I18nHelper';
import { isA11yAllowedInput } from '../../util/events';

import './style.sass';

const mapPropsToState = props => ({
  title: (props.i18n['_title_'] || '').toUpperCase(),
  description: props.i18n['_description_'] || 'No Description',
  caregiverName: props.domain.caregiver_name,
});

/* eslint-disable camelcase */
class Domain extends Component {
  constructor(props) {
    super(props);
    this.state = mapPropsToState(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(mapPropsToState(nextProps));
  }

  renderItems = items => {
    const i18nAll = this.props.i18nAll || {};
    const {
      assessmentUnderSix,
      onRatingUpdate,
      onConfidentialityUpdate,
      domain,
      canReleaseConfidentialInfo,
    } = this.props;
    const caregiverIndex = domain.caregiver_index;
    return items.map((item, index) => {
      const { id, code } = item;
      const itemI18n = getI18nByCode(i18nAll, code);
      return (
        <div key={index}>
          <Item
            key={id}
            item={item}
            caregiverIndex={caregiverIndex}
            i18n={itemI18n}
            onRatingUpdate={onRatingUpdate}
            onConfidentialityUpdate={onConfidentialityUpdate}
            assessmentUnderSix={assessmentUnderSix}
            canReleaseConfidentialInfo={canReleaseConfidentialInfo}
          />
          <Divider />
        </div>
      );
    });
  };

  handleAddCaregiverDomain = event => {
    if (isA11yAllowedInput(event)) {
      this.props.onAddCaregiverDomain(this.props.domain.caregiver_index);
    }
  };

  handleRemoveCaregiverDomain = event => {
    if (isA11yAllowedInput(event)) {
      this.props.onRemoveCaregiverDomain(this.props.domain.caregiver_index);
    }
  };

  handleInternalCaregiverNameUpdate = event => {
    this.setState({ caregiverName: event.target.value });
  };

  handleCaregiverNameUpdate = () => {
    this.props.onCaregiverNameUpdate(this.props.domain.caregiver_index, this.state.caregiverName);
  };

  renderCaregiverName = () => {
    return (
      <div className={'caregiver-name-wrapper'}>
        <Input
          bsSize="lg"
          placeholder="Caregiver Name"
          className={'caregiver-name'}
          value={this.state.caregiverName}
          maxLength={50}
          onChange={this.handleInternalCaregiverNameUpdate}
          onBlur={this.handleCaregiverNameUpdate}
        />
      </div>
    );
  };

  renderCaregiverDomainControls() {
    return (
      <div className={'caregiver-domain-controls'}>
        <h5>
          <ul className={'caregiver-domain-controls-list'}>
            <li>
              <div
                onClick={this.handleRemoveCaregiverDomain}
                onKeyPress={this.handleRemoveCaregiverDomain}
                className={'caregiver-control'}
                role={'button'}
                tabIndex={0}
              >
                - REMOVE CAREGIVER
              </div>
            </li>
            <li>
              <div
                onClick={this.handleAddCaregiverDomain}
                onKeyPress={this.handleAddCaregiverDomain}
                className={'caregiver-control'}
                role={'button'}
                tabIndex={0}
              >
                + ADD CAREGIVER
              </div>
            </li>
          </ul>
        </h5>
      </div>
    );
  }

  render = () => {
    const { assessmentUnderSix } = this.props;
    const { items, under_six, above_six, is_caregiver_domain } = this.props.domain;
    const { title, description, caregiverName } = this.state;
    return (assessmentUnderSix && under_six) || (!assessmentUnderSix && above_six) ? (
      <ExpansionPanel style={{ backgroundColor: '#114161' }}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon style={{ height: '28px', color: 'white' }} />}
          style={{ minHeight: '28px' }}
        >
          <Typography variant="title" style={{ color: 'white' }}>
            {title} {caregiverName && `- ${caregiverName}`}
          </Typography>
          {description ? (
            <Tooltip title={description} placement="top-end" classes={{ popper: 'domain-tooltip' }}>
              <i className="fa fa-question-circle domain-help-icon" />
            </Tooltip>
          ) : null}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ display: 'block', padding: '0', backgroundColor: 'white' }}>
          {is_caregiver_domain && this.renderCaregiverName()}
          {this.renderItems(items)}
          {is_caregiver_domain && this.renderCaregiverDomainControls()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ) : null;
  };
}
/* eslint-enable camelcase */

Domain.propTypes = {
  domain: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  i18nAll: PropTypes.object.isRequired,
  assessmentUnderSix: PropTypes.bool.isRequired,
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  onRatingUpdate: PropTypes.func.isRequired,
  onConfidentialityUpdate: PropTypes.func.isRequired,
  onAddCaregiverDomain: PropTypes.func.isRequired,
  onRemoveCaregiverDomain: PropTypes.func.isRequired,
  onCaregiverNameUpdate: PropTypes.func.isRequired,
};

Domain.defaultProps = {
  domain: {},
  i18n: {},
  i18nAll: {},
  assessmentUnderSix: false,
  canReleaseConfidentialInfo: false,
};

export default Domain;
