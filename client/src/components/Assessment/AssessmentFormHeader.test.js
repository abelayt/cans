import React from 'react';
import { AssessmentFormHeader } from './index';
import { DateTime } from 'luxon';

describe('<AssessmentFormHeader />', () => {
  describe('with child name', () => {
    it('displays correct child name', () => {
      const props = {
        clientFirstName: 'test',
        clientLastName: 'child',
      };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      const selector = '#child-name';

      expect(wrapper.find(selector).text()).toBe('child, test');
    });
  });

  describe('with no child name', () => {
    it('displays default message', () => {
      const wrapper = shallow(<AssessmentFormHeader />);
      const selector = '#no-data';

      expect(wrapper.find(selector).text()).toBe('Client Info');
    });
  });

  describe('select date', () => {
    it('should default to todays date', () => {
      const today = DateTime.local().toISODate();
      const tomorrow = DateTime.local()
        .plus({days: 1})
        .toISODate()

      const props = {
        onAssessmentDateChange: jest.fn(),
        onAssessmentCompletedAsChange: jest.fn(),
        assessmentDate: today,
      };

      const wrapper = shallow(<AssessmentFormHeader {...props}/>);
      expect(wrapper.instance().props.assessmentDate).toBe(today);
      expect(wrapper.find('#date-select').props().value).toBe(today);
      expect(wrapper.instance().props.assessmentDate).not.toBe(tomorrow);
    });

    it('should allow user to change date', () => {
      const today = DateTime.local().toISODate()
      const tomorrow = { target: { value: DateTime.local()
            .plus({days: 1})
            .toISODate()}};

      const handleChange = jest.fn();

      const wrapper = shallow(<AssessmentFormHeader assessmentDate={today} onAssessmentDateChange={handleChange} />);

      expect(wrapper.instance().props.assessmentDate).toBe(today);
      wrapper.instance().handleDateChange(tomorrow);
      expect(handleChange).toBeCalled();
      expect(handleChange).toBeCalledWith(tomorrow.target.value);
    });
  });

  describe('select completedAs', () => {
    it('should default to Communimetric', () => {
      const value = 'Communimetric';

      const wrapper = shallow(<AssessmentFormHeader assessmentCompletedAs={value}/>);
      expect(wrapper.instance().props.assessmentCompletedAs).toBe(value);
    });

    it('should allow user to change completedAs', () => {
      const defaultValue = 'Communimetric';
      const newValue = { target: { value:'Social Worker'}};

      const onAssessmentCompletedAsChange = jest.fn()
      const props = {
        onAssessmentDateChange: jest.fn(),
        assessmentCompletedAs: 'Communimetric',
      };

      const wrapper = shallow(<AssessmentFormHeader {...props} onAssessmentCompletedAsChange={onAssessmentCompletedAsChange} />);

      expect(wrapper.instance().props.assessmentCompletedAs).toBe(defaultValue);
      wrapper.instance().handleSelectCompletedAs(newValue);
      expect(onAssessmentCompletedAsChange).toBeCalledWith(newValue.target.value);
    });
  });

});
