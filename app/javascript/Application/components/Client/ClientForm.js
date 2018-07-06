import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import { withStyles } from '@material-ui/core/styles';
import { MenuItem, TextField, Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { CountiesService } from '../ChildForm/Counties.service';
import PersonService from './person.service';
import { validate, isFormValid } from './ClientForm.validator';
import { PageInfo } from '../Layout/index';
import { Notification } from '../Notification/index';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: 10,
    width: 300,
    fontSize: 20,
  },
  menu: {
    width: 300,
    fontSize: 20,
  },
  card: {
    minWidth: 300,
  },
  cardHeader: {
    backgroundColor: '#114161',
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 24,
  },
  button: {
    marginTop: theme.spacing.unit,
    backgroundColor: '#09798e',
    color: '#ffffff',
    fontSize: 20,
  },
});

class ClientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      child_status: 'idle',
      counties: [],
      childInfo: {
        person_role: 'CLIENT',
        first_name: '',
        last_name: '',
        dob: '',
        case_id: '',
        external_id: '',
        county: {
          id: 0,
          name: '',
        },
      },
      childInfoValidation: {
        first_name: false,
        last_name: false,
        dob: false,
        case_id: false,
        external_id: false,
        county: false,
      },
      isSaveButtonDisabled: true,
      open: false,
      navigate: false,
    };
  }

  handleChange = name => event => {
    const newValue = event.target.value;
    this.setState({
      childInfo: {
        ...this.state.childInfo,
        [name]: newValue,
      },
    });
    this.validateInput(name, newValue);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ child_status: 'updating' });
    PersonService.postClient(this.state.childInfo)
      .then(newChild => {
        this.setState({
          childInfo: newChild,
          child_status: 'ready',
        });
      })
      .then(() => setTimeout(() => this.setState({ navigate: true }), 3000))
      .catch(() => this.setState({ child_status: 'error' }));
  };

  handleCancel = event => {
    this.setState({
      childInfo: {
        ...this.state.childInfo,
        person_role: 'CLIENT',
        first_name: '',
        last_name: '',
        dob: '',
        case_id: '',
        external_id: '',
        county: {
          id: 0,
          name: '',
        },
      },
    });
  };

  componentDidMount() {
    this.fetchCounties();
  }

  fetchCounties = () => {
    this.setState({ counties_status: 'waiting' });
    return CountiesService.fetchCounties()
      .then(this.onFetchCountiesSuccess)
      .catch(() => this.setState({ counties_status: 'error' }));
  };

  onFetchCountiesSuccess = counties => {
    this.setState({
      counties: counties,
      counties_status: 'ready',
    });
  };

  validateInput = (fieldName, inputValue) => {
    const fieldValidation = validate(fieldName, inputValue);
    const allValidations = Object.assign({}, this.state.childInfoValidation);
    allValidations[fieldName] = fieldValidation;
    const formValidation = isFormValid(allValidations);
    this.setState({
      childInfoValidation: {
        ...allValidations,
      },
      isSaveButtonDisabled: !formValidation,
    });
  };

  render() {
    if (this.state.navigate) {
      return <Redirect to={`/clients/${this.state.childInfo.id}`} />;
    }

    const { classes } = this.props;
    return (
      <Fragment>
        <PageInfo title={'Add Child/Youth'} />
        <Card className={classes.card}>
          <CardHeader
            className={classes.cardHeader}
            title="Child/Youth Information"
            classes={{
              title: classes.title,
            }}
          />
          <CardContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                required
                id="first_name"
                label="First Name"
                focused
                error={!this.state.childInfoValidation['first_name']}
                className={classes.textField}
                value={this.state.first_name}
                onChange={this.handleChange('first_name')}
                inputProps={{ maxLength: 50 }}
                margin="normal"
              />

              <TextField
                required
                id="last_name"
                label="Last Name"
                error={!this.state.childInfoValidation['last_name']}
                className={classes.textField}
                value={this.state.last_name}
                onChange={this.handleChange('last_name')}
                inputProps={{ maxLength: 50 }}
                margin="normal"
              />
              <TextField
                required
                id="dob"
                label="Birth Date"
                error={!this.state.childInfoValidation['dob']}
                type="date"
                defaultValue=""
                className={classes.textField}
                onChange={this.handleChange('dob')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                id="case_id"
                label="Case Number"
                error={!this.state.childInfoValidation['case_id']}
                className={classes.textField}
                value={this.state.case_id}
                onChange={this.handleChange('case_id')}
                inputProps={{ maxLength: 50 }}
                margin="normal"
              />

              <InputMask
                mask="9999-9999-9999-9999999"
                value={this.state.external_id}
                onChange={this.handleChange('external_id')}
              >
                {() => (
                  <TextField
                    required
                    id="external_id"
                    label="Client Id"
                    helperText="Enter 19 digits number"
                    error={!this.state.childInfoValidation['external_id']}
                    className={classes.textField}
                    margin="normal"
                  />
                )}
              </InputMask>

              <TextField
                required
                select
                id="county"
                label="County"
                error={!this.state.childInfoValidation['county']}
                className={classes.textField}
                open={this.state.open}
                onClose={this.handleClose}
                value={this.state.childInfo.county}
                onChange={this.handleChange('county')}
                helperText="Please select your County"
                margin="normal"
              >
                <MenuItem value="">
                  <em />
                </MenuItem>
                {this.state.counties.map(option => (
                  <MenuItem key={option.id} value={option} className={classes.menu}>
                    <span id={'county-name'}>{option.name}</span>
                  </MenuItem>
                ))}
              </TextField>
            </form>
          </CardContent>
          <CardActions>
            <Button onClick={this.handleCancel} href="/clients/new">
              Cancel
            </Button>
            <Button
              variant="raised"
              size="large"
              color="primary"
              disabled={this.state.isSaveButtonDisabled}
              className={classes.button}
              onClick={this.handleSubmit}
            >
              Save
            </Button>
          </CardActions>
        </Card>
        {this.state.child_status === 'ready' && (
          <Notification messageText="Success! New Child/Youth record has been saved." />
        )}
      </Fragment>
    );
  }
}

ClientForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClientForm);
