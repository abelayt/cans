import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import { Row, Col, Button } from 'reactstrap';
import { withStyles } from '@material-ui/core/styles';
import { MenuItem, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { CountiesService } from './Counties.service';
import { ClientService } from './Client.service';
import { validate, validateCaseNumber, validateCaseNumbersAreUnique, isFormValid } from './ClientFormValidator';
import { PageInfo } from '../Layout';
import { isA11yAllowedInput } from '../../util/events';
import { clone } from '../../util/common';

import './style.sass';

const styles = theme => ({
  inputText: {
    color: '#111',
    fontSize: 16,
  },
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
  cardWidth: {
    minWidth: 300,
  },
  cardHeader: {
    backgroundColor: '#114161',
    color: '#fff',
  },
  note: {
    color: '#ff0000',
    marginTop: theme.spacing.unit,
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

class ClientAddEditForm extends Component {
  constructor(props) {
    super(props);
    const isNewForm = !this.props.match.params.id;
    this.state = {
      isNewForm,
      childInfo: {
        person_role: 'CLIENT',
        first_name: '',
        last_name: '',
        dob: '',
        external_id: '',
        county: {
          id: 0,
          name: '',
        },
        cases: [
          {
            external_id: '',
          },
        ],
      },
      childInfoValidation: {
        first_name: !isNewForm,
        last_name: !isNewForm,
        dob: !isNewForm,
        external_id: !isNewForm,
        county: !isNewForm,
        cases: [
          {
            external_id: true,
          },
        ],
      },
      counties: [],
      isSaveButtonDisabled: isNewForm,
      redirection: {
        shouldRedirect: false,
        successClientId: null,
      },
    };
  }

  componentDidMount() {
    this.fetchCounties();
    if (!this.state.isNewForm) {
      this.fetchChildData(this.props.match.params.id);
    }
  }

  fetchChildData = id => {
    return ClientService.getClient(id)
      .then(this.onFetchChildDataSuccess)
      .catch(() => {});
  };

  onFetchChildDataSuccess = childInfo => {
    const childInfoValidation = {
      ...this.state.childInfoValidation,
      cases: [],
    };
    for (let i = 0; i < childInfo.cases.length; i++) {
      childInfoValidation.cases.push({ external_id: true });
    }
    this.setState({
      childInfo,
      childInfoValidation,
    });
  };

  fetchCounties = () => {
    return CountiesService.fetchCounties()
      .then(this.onFetchCountiesSuccess)
      .catch(() => {});
  };

  onFetchCountiesSuccess = counties => {
    this.setState({ counties });
  };

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

  validateInput = (fieldName, inputValue) => {
    const allValidations = this.state.childInfoValidation;
    allValidations[fieldName] = validate(fieldName, inputValue);
    this.setState({
      childInfoValidation: {
        ...allValidations,
      },
      isSaveButtonDisabled: !isFormValid(allValidations),
    });
  };

  handleChangeCaseNumber = caseIndex => event => {
    const cases = clone(this.state.childInfo.cases);
    cases[caseIndex].external_id = event.target.value;
    const childInfoValidation = {
      ...this.state.childInfoValidation,
      cases: this.validateCaseNumbers(cases),
    };
    this.setState({
      childInfo: {
        ...this.state.childInfo,
        cases,
      },
      childInfoValidation,
      isSaveButtonDisabled: !isFormValid(childInfoValidation),
    });
  };

  validateCaseNumbers = cases => {
    const casesValidations = clone(this.state.childInfoValidation.cases);
    for (const [index, aCase] of cases.entries()) {
      casesValidations[index].external_id = validateCaseNumber(aCase.external_id);
    }
    const nonUniqueCasesIndices = validateCaseNumbersAreUnique(cases);
    nonUniqueCasesIndices.forEach(index => (casesValidations[index].external_id = false));
    return casesValidations;
  };

  handleSubmit = event => {
    const childInfo = this.prepareChildForSubmit(clone(this.state.childInfo));
    if (this.state.isNewForm) {
      event.preventDefault();
      ClientService.addClient(childInfo)
        .then(newChild => {
          this.setState({
            childInfo: newChild,
            redirection: {
              shouldRedirect: true,
              successClientId: newChild.id,
            },
          });
        })
        .catch(() => {});
    } else {
      ClientService.updateClient(childInfo.id, childInfo)
        .then(newChild => {
          this.setState({
            childInfo: newChild,
            redirection: {
              shouldRedirect: true,
              successClientId: newChild.id,
            },
          });
        })
        .catch(() => {});
    }
  };

  prepareChildForSubmit(childInfo) {
    const cases = childInfo.cases;
    for (let i = cases.length - 1; i >= 0; i--) {
      if (!cases[i].external_id) {
        cases.splice(i, 1);
      }
    }
    return childInfo;
  }

  handleCancel = () => {
    this.setState({
      redirection: {
        shouldRedirect: true,
      },
    });
  };

  handleAddCaseNumber = event => {
    if (isA11yAllowedInput(event)) {
      const childInfo = this.addCaseNumberToChildInfo();
      const childInfoValidation = this.addCaseNumberToValidations();
      this.setState({
        childInfo,
        childInfoValidation,
        isSaveButtonDisabled: !isFormValid(childInfoValidation),
      });
    }
  };

  addCaseNumberToChildInfo = () => {
    const cases = clone(this.state.childInfo.cases);
    cases.push({ external_id: '' });
    return {
      ...this.state.childInfo,
      cases: cases,
    };
  };

  addCaseNumberToValidations = () => {
    const casesValidation = clone(this.state.childInfoValidation.cases);
    casesValidation.push({ external_id: true });
    return {
      ...this.state.childInfoValidation,
      cases: casesValidation,
    };
  };

  render() {
    const { classes } = this.props;
    const { isNewForm, childInfo, childInfoValidation, counties, isSaveButtonDisabled, redirection } = this.state;
    const { shouldRedirect, successClientId } = redirection;

    if (shouldRedirect) {
      const pathName = isNewForm && !successClientId ? `/` : `/clients/${childInfo.id}`;
      return <Redirect push to={{ pathname: pathName, state: { isNewForm, successClientId } }} />;
    }

    return (
      <Fragment>
        <PageInfo title={isNewForm ? 'Add Child/Youth' : 'Edit Child/Youth'} />
        <Card className={classes.cardWidth}>
          <CardHeader
            className={'card-header-cans'}
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
                error={!childInfoValidation['first_name']}
                className={classes.textField}
                value={childInfo.first_name}
                onChange={this.handleChange('first_name')}
                inputProps={{
                  maxLength: 50,
                  className: classes.inputText,
                }}
                margin="normal"
                InputLabelProps={{
                  style: {
                    color: '#777777',
                    fontSize: '1.8rem',
                  },
                }}
              />

              <TextField
                required
                id="last_name"
                label="Last Name"
                error={!childInfoValidation['last_name']}
                className={classes.textField}
                value={childInfo.last_name}
                onChange={this.handleChange('last_name')}
                inputProps={{ maxLength: 50, className: classes.inputText }}
                margin="normal"
                InputLabelProps={{
                  style: {
                    color: '#777777',
                    fontSize: '1.8rem',
                  },
                }}
              />

              <TextField
                required
                id="dob"
                label="Date of Birth"
                value={childInfo.dob}
                error={!childInfoValidation['dob']}
                type="date"
                className={classes.textField}
                onChange={this.handleChange('dob')}
                inputProps={{ className: classes.inputText }}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: '#777777',
                    fontSize: '1.8rem',
                  },
                }}
              />

              <InputMask
                mask="9999-9999-9999-9999999"
                value={childInfo.external_id}
                onChange={this.handleChange('external_id')}
              >
                {() => (
                  <TextField
                    required
                    id="external_id"
                    label="Client Id"
                    helperText="Enter 19 digits number"
                    error={!childInfoValidation['external_id']}
                    className={classes.textField}
                    margin="normal"
                    inputProps={{ className: classes.inputText }}
                    InputLabelProps={{
                      style: {
                        color: '#777777',
                        fontSize: '1.8rem',
                      },
                    }}
                    FormHelperTextProps={{
                      style: {
                        fontSize: '1rem',
                      },
                    }}
                  />
                )}
              </InputMask>

              <TextField
                required
                select
                id="county"
                label="County"
                error={!childInfoValidation['county']}
                className={classes.textField}
                value={childInfo.county}
                onChange={this.handleChange('county')}
                helperText="Please select your County"
                margin="normal"
                inputProps={{ className: classes.inputText }}
                InputLabelProps={{
                  style: {
                    color: '#777777',
                    fontSize: '1.8rem',
                  },
                }}
                FormHelperTextProps={{
                  style: {
                    fontSize: '1rem',
                  },
                }}
              >
                {!isNewForm && (
                  <MenuItem className={classes.menu} selected={true} value={childInfo.county}>
                    {childInfo.county.name}
                  </MenuItem>
                )}

                {counties.map(option => (
                  <MenuItem key={option.id} value={option} className={classes.menu}>
                    <span id={'county-name'}>{option.name}</span>
                  </MenuItem>
                ))}
              </TextField>

              <div className={'case-numbers'}>
                {childInfo.cases.map((aCase, index) => (
                  <TextField
                    key={index}
                    id={`caseNumber${index}`}
                    label={index === 0 ? 'Case Number' : null}
                    error={!childInfoValidation.cases[index].external_id}
                    className={classes.textField}
                    value={aCase.external_id}
                    onChange={this.handleChangeCaseNumber(index)}
                    inputProps={{ maxLength: 50, className: classes.inputText }}
                    margin="normal"
                    InputLabelProps={{
                      style: {
                        color: '#777777',
                        fontSize: '1.8rem',
                      },
                    }}
                  />
                ))}
                <div className={'case-numbers-controls'}>
                  <h5>
                    <div
                      onClick={this.handleAddCaseNumber}
                      onKeyPress={this.handleAddCaseNumber}
                      className={'case-numbers-single-control'}
                      role={'button'}
                      tabIndex={0}
                    >
                      + ADD CASE NUMBER
                    </div>
                  </h5>
                </div>
              </div>
            </form>
            <div className={'add-edit-form-footer'}>
              <Row>
                <Col sm={4}>{this.state.isSaveButtonDisabled && <p className={classes.note}>*required fields</p>}</Col>
                <Col sm={8} className={'add-edit-form-controls'}>
                  <Button id={'cancel-button'} color={'link'} className={'cancel-button'} onClick={this.handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    id={'save-button'}
                    color={'primary'}
                    disabled={isSaveButtonDisabled}
                    onClick={this.handleSubmit}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </div>
          </CardContent>
        </Card>
      </Fragment>
    );
  }
}

ClientAddEditForm.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClientAddEditForm);
