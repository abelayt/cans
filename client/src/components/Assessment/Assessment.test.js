import React from 'react';
import { Assessment, AssessmentFormHeader, AssessmentService } from './index';
import { childInfoJson } from '../Client/person.helper.test';
import PersonService from '../Client/person.service';
import { DateTime } from 'luxon';
import { shallow } from 'enzyme/build/index';
import { PageInfo } from '../Layout';
import Typography from '@material-ui/core/Typography/Typography';
import AssessmentFormFooter from './AssessmentFormFooter';

const initialAssessment = {
  instrument_id: 1,
  person: childInfoJson,
  assessment_type: "INITIAL",
  status: 'IN_PROGRESS',
  completed_as: 'COMMUNIMETRIC',
  state: {
    'id': 0,
    'under_six': false,
    'domains': [
      {
        'id': 0,
        'code': 'string',
        'underSix': false,
        'aboveSix': false,
      },
    ],
  },
  event_date: DateTime.local().toISODate(),
};

const assessment = {
  id: 1,
  instrument_id: 1,
  person: childInfoJson,
  assessment_type: 'INITIAL',
  status: 'IN_PROGRESS',
  completed_as: 'COMMUNIMETRIC',
  state: {
    id: 0,
    under_six: false,
    domains: [
      {
        id: 0,
        code: '123',
        underSix: false,
        aboveSix: false,
      },
    ],
  },
  event_date: '2018-06-11',
};

const updatedAssessment = {
  id: 1,
  instrument_id: 1,
  person: childInfoJson,
  assessment_type: 'INITIAL',
  status: 'IN_PROGRESS',
  completed_as: 'COMMUNIMETRIC',
  state: {
    id: 0,
    under_six: true,
    domains: [
      {
        id: 0,
        code: '456',
        underSix: false,
        aboveSix: true,
      },
      {
        id: 1,
        code: '780',
        underSix: false,
        aboveSix: true,
      },
    ],
  },
  event_date: '2018-06-11',
};

const instrument = {
  id: 1,
  prototype: {
    id: 0,
    under_six: false,
    domains: [
      {
        id: 0,
        code: 'string',
        underSix: false,
        aboveSix: false,
      },
    ],
  },
};

describe('<Assessment />', () => {
  describe('init Assessment', () => {
    describe('every assessment', () => {
      describe('page layout', () => {
        const props = {
          location: { childId: 10 },
          match: { params: { id: undefined } },
        };
        const getWrapper = () => shallow(<Assessment {...props}/>);
        const getLength = component => getWrapper().find(component).length;

        it('renders with 1 <PageInfo /> component', () => {
          expect(getLength(PageInfo)).toBe(1);
        });

        it('renders with 1 <AssessmentFormHeader /> component', () => {
          expect(getLength(AssessmentFormHeader)).toBe(1);
        });

        it('renders with 1 <Typography /> component', () => {
          expect(getLength(Typography)).toBe(1);
        });

        it('renders with 1 <AssessmentFormFooter /> component', () => {
          expect(getLength(AssessmentFormFooter)).toBe(1);
        });

      });
      const personServiceFetchSpy = jest.spyOn(PersonService, 'fetch');

      beforeEach(() => {
        personServiceFetchSpy.mockClear();
      });

      it('will load client data', async () => {
        const props = {
          location: { childId: 10 },
          match: { params: { id: undefined } },
        };

        personServiceFetchSpy.mockReturnValue(Promise.resolve(childInfoJson));

        const wrapper = shallow(<Assessment {...props} />);
        await wrapper.instance().componentDidMount();

        expect(wrapper.instance().state.child.first_name).toBe('Test');
        expect(wrapper.instance().state.child.first_name).not.toBe('adam');
      });
    });

    describe('assessment with no existing assessment', () => {
      const props = {
        location: { childId: 1 },
        match: { params: { id: undefined } },
      };

      it('calls fetchNewAssessment', () => {
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetchNewAssessment');
        const wrapper = shallow(<Assessment {...props} />);

        wrapper.instance().componentDidMount();
        expect(assessmentServiceGetSpy).toHaveBeenCalled();

        assessmentServiceGetSpy.mockClear()
      });

      it('sets a new assessment on component state', () => {
        const wrapper = shallow(<Assessment {...props} />);
        wrapper.setState({child:childInfoJson})

        expect(wrapper.state('assessment').instrument_id).toBeFalsy();
        wrapper.instance().onFetchNewAssessmentSuccess(instrument);
        expect(wrapper.state('assessment')).toEqual(initialAssessment);
      })
    });

    describe('assessment with an existing assessment', () => {

      it('calls fetchAssessment', () => {
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetchNewAssessment');
        const props = {
          location: { childId: 1 },
          match: { params: { id: 1 } },
        };

        const wrapper = shallow(<Assessment {...props} />);

        wrapper.instance().componentDidMount();
        expect(assessmentServiceGetSpy).toHaveBeenCalled();

        assessmentServiceGetSpy.mockClear()
      });
    });

  });

  describe('save assessment', () => {
    describe('with a new assessment', () => {
      it('should call AssessmentService.postAssessment', () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment');
        const props = {
          location: { childId: 1 },
          match: { params: { id: 1 } },
        };

        const wrapper = shallow(<Assessment {...props} />);
        wrapper.instance().handleSaveAssessment();

        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment));
        expect(assessmentServicePostSpy).toHaveBeenCalled();

        assessmentServicePostSpy.mockClear();
      });
    });

    describe('with an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update');
        const props = {
          location: { childId: 1 },
          match: { params: { id: 1 } },
        };
        const wrapper = shallow(<Assessment {...props} />);

        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment));

        wrapper.setState({assessment: {id:1}});
        wrapper.instance().handleSaveAssessment();

        expect(assessmentServicePutSpy).toHaveBeenCalled();

        assessmentServicePutSpy.mockClear();
      });

      it('should update state with assessment', async () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update');
        const props = {
          location: { childId: 1 },
          match: { params: { id: 1 } },
        };
        const wrapper = shallow(<Assessment {...props} />);

        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment));

        wrapper.setState({assessment: {id:1}});
        await wrapper.instance().handleSaveAssessment();

        expect(assessmentServicePutSpy).toHaveBeenCalled();
        expect(wrapper.state('assessment').id).toBe(1);
        expect(wrapper.state('assessment').state.domains).toBeTruthy();

        assessmentServicePutSpy.mockClear();
      });
    });
  });

  describe('update assessment', () => {
    describe('is passed updated data', () => {
      it('will update the assessment on the component state', () => {
        const props = {
          location: { childId: 1 },
          match: { params: { id: 1 } },
        };
        const wrapper = shallow(<Assessment {...props} />);

        wrapper.setState({assessment: assessment});
        expect(wrapper.state('assessment')).toEqual(assessment);
        wrapper.instance().updateAssessment(updatedAssessment);
        expect(wrapper.state('assessment')).toEqual(updatedAssessment);
      });
    });
  });

  describe('initial save', () => {
    it('will update the assessment on the component state', () => {
      const props = {
        location: { childId: 1 },
        match: { params: { id: 1 } },
        history: { push: jest.fn() },
      };
      const wrapper = shallow(<Assessment {...props} />);

      wrapper.setState({ assessment: assessment });
      expect(wrapper.state('assessment')).toEqual(assessment);
      wrapper.instance().initialSave(updatedAssessment);
      expect(wrapper.state('assessment')).toEqual(updatedAssessment);
    });

    it('will update the url with the assessment id', () => {
      const props = {
        location: { childId: 1 },
        match: { params: { id: 1 } },
      };

      const historyPushMock = {push: jest.fn()}
      const wrapper = shallow(<Assessment {...props} history={historyPushMock}/>);

      wrapper.setState({child: childInfoJson});
      wrapper.instance().initialSave(updatedAssessment);

      expect(historyPushMock.push).toHaveBeenCalled();
      expect(historyPushMock.push).toHaveBeenCalledWith('/clients/10/assessments/1');

      historyPushMock.push.mockClear();
    });
  });

  describe('toggleUnderSix', () => {
    it('will set under six to its opposite', () => {
      const props = {
        location: { childId: 1 },
        match: { params: { id: 1 } },
      };
      const wrapper = shallow(<Assessment {...props} />);

      wrapper.setState({ assessment: {state:{under_six:true}} });
      expect(wrapper.state('assessment').state.under_six).toEqual(true);
      wrapper.instance().toggleUnderSix();
      expect(wrapper.state('assessment').state.under_six).toEqual(false);
    });
  });
});
