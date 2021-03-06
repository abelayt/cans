import React from 'react';
import { shallow } from 'enzyme';
import { AssessmentFormHeader } from './index';
import { Alert } from '@cwds/components';
import { assessment, client } from './assessment.mocks.test';

describe('<AssessmentFormHeader />', () => {
  describe('#handleValueChange()', () => {
    it('will update event_date in assessment', () => {
      // given
      const mockFn = jest.fn();
      const props = { assessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(assessment.event_date).toBe('2018-06-11');
      // when
      const event = { target: { name: 'event_date', value: '2000-01-11' } };
      wrapper.instance().handleValueChange(event);
      // then
      const updatedAssessment = JSON.parse(JSON.stringify(assessment));
      updatedAssessment.event_date = '2000-01-11';
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });

    it('will update completed_as in assessment', () => {
      // given
      const mockFn = jest.fn();
      const props = { assessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(assessment.completed_as).toBe('COMMUNIMETRIC');
      // when
      const event = { target: { name: 'completed_as', value: 'Social Worker' } };
      wrapper.instance().handleValueChange(event);
      // then
      const updatedAssessment = JSON.parse(JSON.stringify(assessment));
      updatedAssessment.completed_as = 'Social Worker';
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('#handleHasCaregiverChange()', () => {
    it('will update has_caregiver in assessment', () => {
      // given
      const mockFn = jest.fn();
      const sentAssessment = JSON.parse(JSON.stringify(assessment));
      sentAssessment.has_caregiver = true;
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);

      // when
      const event = { target: { name: 'has_caregiver', value: 'false' } };
      wrapper.instance().handleHasCaregiverChange(event);

      // then
      const updatedAssessment = JSON.parse(JSON.stringify(assessment));
      updatedAssessment.has_caregiver = false;
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('#handleCanReleaseInfoChange()', () => {
    it('will update can_release_confidential_info in assessment and set confidential_by_default items to confidential', () => {
      // given
      const mockFn = jest.fn();
      const sentAssessment = JSON.parse(JSON.stringify(assessment));
      sentAssessment.can_release_confidential_info = true;
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(sentAssessment.state.domains[0].items[3].confidential).toBe(false);
      // when
      const event = { target: { name: 'can_release_confidential_info', value: 'false' } };
      wrapper.instance().handleCanReleaseInfoChange(event);
      // then
      const updatedAssessment = JSON.parse(JSON.stringify(assessment));
      updatedAssessment.can_release_confidential_info = false;
      updatedAssessment.state.domains[0].items[3].confidential = true;
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('#toggleUnderSix()', () => {
    it('will set under_six to its opposite', () => {
      // given
      const mockFn = jest.fn();
      const props = { assessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(assessment.state.under_six).toBe(false);
      // when
      wrapper.instance().toggleUnderSix();
      // then
      const updatedAssessment = JSON.parse(JSON.stringify(assessment));
      updatedAssessment.state.under_six = true;
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('with client', () => {
    it('displays correct client name', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(wrapper.find('#child-name').text()).toBe('Doe, John');
    });
  });

  describe('with no client', () => {
    it('displays default message', () => {
      const props = { assessment, client: {}, onAssessmentUpdate: jest.fn() };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(wrapper.find('#no-data').text()).toBe('Client Info');
    });
  });

  describe('warning alert', () => {
    it('should render Alert component when canReleaseInformation is false', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      const alert = wrapper.find(Alert);
      expect(alert.length).toBe(1);
      expect(wrapper.find(Alert).html()).toMatch(
        /Prior to sharing the CANS assessment redact item number 7, 48, EC.41 and EC.18/
      );
    });

    it('should not render Alert component when canReleaseInformation is true', () => {
      const sentAssessment = JSON.parse(JSON.stringify(assessment));
      sentAssessment.can_release_confidential_info = true;
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: jest.fn() };

      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      const alert = wrapper.find(Alert);
      expect(alert.length).toBe(0);
    });
  });
});
