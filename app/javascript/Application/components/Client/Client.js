import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { PageInfo } from '../Layout';
import { ClientAssessmentHistory, ClientService } from './index';
import Button from '@material-ui/core/Button/Button';
import { CloseableAlert, alertType } from '../common/CloseableAlert';
import { Link } from 'react-router-dom';

import './style.sass';

class Client extends Component {
  constructor(props) {
    super(props);

    const { isNewForm, successClientId } = (this.props.location || {}).state || {};
    if (successClientId && this.props.history) {
      this.props.history.replace({ ...this.props.location, state: {} });
    }

    this.state = {
      isNewForm,
      childData: {},
      shouldRenderClientMessage: !!successClientId,
    };
  }

  componentDidMount() {
    this.fetchChildData(this.props.match.params.id);
  }

  fetchChildData(id) {
    return ClientService.fetch(id)
      .then(data => this.setState({ childData: data }))
      .catch(() => this.setState({ childData: {} }));
  }

  renderClientData(data, label, gridSize = 3) {
    return (
      <Grid item xs={gridSize}>
        <Typography variant={'headline'} color={'textSecondary'}>
          {label}
        </Typography>
        {data}
      </Grid>
    );
  }

  formatClientId = num => {
    if (num) {
      if (num.length === 19) {
        const firstFour = num.substring(0, 4);
        const secondFour = num.substring(4, 8);
        const thirdFour = num.substring(8, 12);
        const fourthFour = num.substring(12, 19);
        return `${firstFour}-${secondFour}-${thirdFour}-${fourthFour}`;
      } else if (num.length === 22) {
        return num;
      } else {
        return '0';
      }
    }
  };

  render() {
    const { isNewForm, childData, shouldRenderClientMessage } = this.state;
    return (
      <Fragment>
        <PageInfo title={'Child/Youth Profile'} />
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card className={'card'}>
              <CardHeader
                className={'card-header-cans'}
                title="Child/Youth Information"
                action={
                  <Link to={`/clients/edit/${childData.id}`}>
                    <Button size="small" color="inherit" className={'card-header-cans-button'}>
                      EDIT
                    </Button>
                  </Link>
                }
              />
              <div className={'content'}>
                <CardContent>
                  {shouldRenderClientMessage && (
                    <CloseableAlert
                      type={alertType.SUCCESS}
                      message={
                        isNewForm
                          ? 'Success! New Child/Youth record has been added.'
                          : 'Success! Child/Youth record has been updated.'
                      }
                      isCloseable
                      isAutoCloseable
                    />
                  )}

                  {childData && childData.id ? (
                    <Grid container spacing={24}>
                      {this.renderClientData(childData.first_name, 'First Name')}
                      {this.renderClientData(childData.middle_name, 'Middle Name')}
                      {this.renderClientData(childData.last_name, 'Last Name')}
                      {this.renderClientData(childData.suffix, 'Suffix')}
                      {this.renderClientData(childData.dob, 'Birth Date')}
                      {this.renderClientData(childData.county.name, 'County')}
                      {this.renderClientData(this.formatClientId(childData.external_id), 'Client Id', 6)}
                      {this.renderClientData(undefined, undefined, 6)}
                      {this.renderClientData(childData.case_id, 'Case Number', 6)}
                    </Grid>
                  ) : (
                    <span id={'no-data'}>No Child Data Found</span>
                  )}
                </CardContent>
              </div>
            </Card>
          </Grid>
          <ClientAssessmentHistory
            clientId={childData.id}
            location={this.props.location}
            history={this.props.history}
          />
        </Grid>
      </Fragment>
    );
  }
}

Client.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Client;
