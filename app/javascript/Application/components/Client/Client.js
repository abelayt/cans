import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { PageInfo } from '../Layout';
import { ClientAssessmentHistory, PersonService } from './index';

import './style.sass';

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childData: {},
    };
  }

  static propTypes = {
    /** React-router match object */
    match: PropTypes.object.isRequired,
    /** React-router location object */
    location: PropTypes.object,
    /** React-router history object */
    history: PropTypes.object,
  };

  componentDidMount() {
    this.fetchChildData(this.props.match.params.id);
  }

  fetchChildData(id) {
    return PersonService.fetch(id)
      .then(data => this.setState({ childData: data }))
      .catch(() => this.setState({ childData: {} }));
  }

  renderClientData(data, label) {
    if (data) {
      return (
        <Grid item xs={6}>
          <Typography variant={'headline'} color={'textSecondary'}>
            {label}
          </Typography>
          {data}
        </Grid>
      );
    }
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
    const childData = this.state.childData;
    return (
      <Fragment>
        <PageInfo title={'Child/Youth Profile'} />
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card className={'card'}>
              <CardHeader className={'card-header-cans'} title="Child/Youth Information" />
              <div className={'content'}>
                <CardContent>
                  {childData && childData.id ? (
                    <Grid container spacing={24}>
                      {this.renderClientData(childData.first_name, 'First Name')}
                      {this.renderClientData(childData.last_name, 'Last Name')}
                      {this.renderClientData(childData.dob, 'Birth Date')}
                      {this.renderClientData(childData.case_id, 'Case Number')}
                      {this.renderClientData(this.formatClientId(childData.external_id), 'Client Id')}
                      {this.renderClientData(childData.county.name, 'County')}
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

export default Client;
