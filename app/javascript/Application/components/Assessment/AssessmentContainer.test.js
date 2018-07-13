import React from 'react';
import { AssessmentContainer, AssessmentFormHeader, AssessmentService } from './index';
import { childInfoJson } from '../Client/person.helper.test';
import PersonService from '../Client/person.service';
import { shallow, mount } from 'enzyme';
import { PageInfo } from '../Layout';
import Typography from '@material-ui/core/Typography/Typography';
import AssessmentFormFooter from './AssessmentFormFooter';
import { MemoryRouter } from 'react-router-dom';
import { assessment, updatedAssessment, initialAssessment, instrument } from './assessment.mocks.test';
import { DateTime } from 'luxon';

const defaultProps = {
  location: { childId: 1 },
  match: { params: { id: 1 } },
};

const mountWithRouter = async component => mount(<MemoryRouter initialEntries={['/random']}>{component}</MemoryRouter>);

describe('<AssessmentContainer />', () => {
  describe('init AssessmentContainer', () => {
    describe('page layout', () => {
      const props = {
        location: { childId: 10 },
        match: { params: { id: undefined } },
      };
      const getWrapper = () => shallow(<AssessmentContainer {...props} />);
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

    describe('every assessment', () => {
      it('will load client data', async () => {
        const props = {
          location: { childId: 10 },
          match: { params: { id: undefined } },
        };
        const personServiceFetchSpy = jest.spyOn(PersonService, 'fetch');
        personServiceFetchSpy.mockReturnValue(Promise.resolve(childInfoJson));
        const wrapper = shallow(<AssessmentContainer {...props} />);
        await wrapper.instance().componentDidMount();
        expect(wrapper.instance().state.child.first_name).toBe('Test');
      });
    });

    describe('assessment form with no existing assessment', () => {
      const props = {
        location: { childId: 1 },
        match: { params: { id: undefined } },
      };

      it('calls fetchNewAssessment', () => {
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetchNewAssessment');
        const wrapper = shallow(<AssessmentContainer {...props} />);

        wrapper.instance().componentDidMount();
        expect(assessmentServiceGetSpy).toHaveBeenCalledWith();
      });

      it('sets a new assessment on component state', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />);
        wrapper.setState({ child: childInfoJson });
        expect(wrapper.state('assessment').instrument_id).toBeFalsy();
        wrapper.instance().onFetchNewAssessmentSuccess(instrument);
        expect(wrapper.state('assessment')).toEqual(initialAssessment);
      });
    });

    describe('assessment form with an existing assessment', () => {
      it('calls fetchAssessment', () => {
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetchNewAssessment');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        wrapper.instance().componentDidMount();
        expect(assessmentServiceGetSpy).toHaveBeenCalledWith();
      });
    });
  });

  describe('save assessment', () => {
    describe('with a new assessment', () => {
      it('should call AssessmentService.postAssessment', () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        const assessment = { event_date: DateTime.local().toISODate(), person: {}, state: { domains: [] } };
        wrapper.instance().handleSaveAssessment();
        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment));
        expect(assessmentServicePostSpy).toHaveBeenCalledWith(assessment);
      });
    });

    describe('with an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment));
        wrapper.setState({ assessment: { id: 1 } });
        wrapper.instance().handleSaveAssessment();
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: {} });
      });

      it('should update state with assessment', async () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment));
        wrapper.setState({ assessment: { id: 1 } });
        await wrapper.instance().handleSaveAssessment();
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: {} });
        expect(wrapper.state('assessment').id).toBe(1);
        expect(wrapper.state('assessment').state.domains).toBeTruthy();
      });
    });
  });

  describe('submit assessment', () => {
    describe('when a new assessment', () => {
      it('should call AssessmentService.postAssessment', () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment');
        const props = {
          match: { params: { id: 1 } },
        };

        const wrapper = shallow(<AssessmentContainer {...props} />);
        wrapper.instance().handleSubmitAssessment();

        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment));
        const expectedArgument = {
          event_date: DateTime.local().toISODate(),
          person: {},
          state: { domains: [] },
          status: 'SUBMITTED',
        };
        expect(assessmentServicePostSpy).toHaveBeenCalledWith(expectedArgument);
      });
    });

    describe('when an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update');
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment));
        wrapper.setState({ assessment: { id: 1 } });
        wrapper.instance().handleSubmitAssessment();
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: {}, status: 'SUBMITTED' });
      });
    });
  });

  describe('update assessment', () => {
    describe('is passed updated data', () => {
      it('will update the assessment on the component state', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        wrapper.setState({ assessment: assessment });
        expect(wrapper.state('assessment')).toEqual(assessment);
        wrapper.instance().updateAssessment(updatedAssessment);
        expect(wrapper.state('assessment')).toEqual(updatedAssessment);
      });

      it('validates assessment for submit', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />);
        wrapper.setState({ assessment: updatedAssessment });
        expect(wrapper.state('isValidForSubmit')).toEqual(false);
        wrapper.instance().updateAssessment(assessment);
        expect(wrapper.state('isValidForSubmit')).toEqual(true);
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
      const wrapper = shallow(<AssessmentContainer {...props} />);

      wrapper.setState({ assessment: assessment });
      expect(wrapper.state('assessment')).toEqual(assessment);
      wrapper.instance().initialSave(updatedAssessment);
      expect(wrapper.state('assessment')).toEqual(updatedAssessment);
    });

    it('will update the url with the assessment id', () => {
      const historyPushMock = { push: jest.fn() };
      const wrapper = shallow(<AssessmentContainer {...defaultProps} history={historyPushMock} />);

      wrapper.setState({ child: childInfoJson });
      wrapper.instance().initialSave(updatedAssessment);

      expect(historyPushMock.push).toHaveBeenCalledWith('/clients/10/assessments/1');
    });
  });

  describe('buttons', () => {
    describe('Cancel button', () => {
      it('redirects to client page', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer match={{ params: { id: 1 } }} />);
        expect(wrapper.find('Redirect').length).toBe(0);
        await wrapper
          .find('AssessmentContainer')
          .instance()
          .handleCancelClick();
        const redirect = wrapper.update().find('Redirect');
        expect(redirect.length).toBe(1);
        expect(redirect.first().props().to.state.successAssessmentId).toBe(undefined);
      });
    });

    describe('Submit button', () => {
      it('is disabled/enabled based on the assessment validity', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer match={{ params: { id: 1 } }} />);
        await wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({ isValidForSubmit: false });
        wrapper.update();
        expect(
          wrapper
            .find('button#submit-assessment')
            .first()
            .props().disabled
        ).toBe(true);
        await wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({ isValidForSubmit: true });
        wrapper.update();
        expect(
          wrapper
            .find('button#submit-assessment')
            .first()
            .props().disabled
        ).toBe(false);
      });

      it('redirects to client page on Submit button clicked', async () => {
        // given
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment');
        assessmentServicePostSpy.mockReturnValue(Promise.resolve({ id: 123 }));
        const historyArray = [];
        const wrapper = await mountWithRouter(
          <AssessmentContainer match={{ params: { id: 1 } }} history={historyArray} />
        );
        expect(wrapper.find('Redirect').length).toBe(0);

        // when
        const instance = wrapper.find('AssessmentContainer').instance();
        await instance.handleSubmitAssessment();

        // then
        await wrapper.update();
        const redirect = wrapper.find('Redirect');
        expect(redirect.length).toBe(1);
        expect(redirect.first().props().to.state.successAssessmentId).toBe(123);
        expect(historyArray.length).toBe(1);
      });
    });
  });
});
