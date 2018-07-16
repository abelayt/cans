import React from 'react';
import { Assessment, Domain } from './';
import { mount, shallow } from 'enzyme';
import { cloneDeep } from 'lodash';

import { assessment, i18n } from './assessment.mocks.test';

const enhanceDomainToCaregiver = domain => ({ ...domain, is_caregiver_domain: true, caregiver_index: 'a' });

describe('<Assessment />', () => {
  describe('assessment form with data', () => {
    it('renders with 1 <Domain /> component', () => {
      const wrapper = mount(<Assessment assessment={assessment} i18n={i18n} />);
      expect(wrapper.find(Domain).length).toBe(1);
    });
  });

  describe('#updateItem()', () => {
    describe('onUpdateAssessment call back', () => {
      describe('rating', () => {
        it('is invoked when item rating is updated', () => {
          const mockFn = jest.fn();
          const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={assessment} i18n={i18n} />);
          expect(assessment.state.domains[0].items[0].rating).toBe(1);
          wrapper.instance().handleUpdateItemRating('1', 2);
          const newAssessment = cloneDeep(assessment);
          newAssessment.state.domains[0].items[0].rating = 2;
          expect(mockFn).toHaveBeenCalledWith(newAssessment);
        });

        it('is invoked when item rating is updated for caregiver domain', () => {
          // given
          const mockFn = jest.fn();
          const initialAssessment = cloneDeep(assessment);
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0]);
          const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />);

          // when
          expect(initialAssessment.state.domains[0].items[0].rating).toBe(1);
          wrapper.instance().handleUpdateItemRating('1', 2, 'a');

          // then
          const updatedAssessment = cloneDeep(assessment);
          updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0]);
          updatedAssessment.state.domains[0].items[0].rating = 2;
          expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
        });
      });

      describe('confidentiality', () => {
        it('is invoked when item confidentiality is updated', () => {
          const mockFn = jest.fn();
          const initialAssessment = cloneDeep(assessment);
          const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />);
          expect(initialAssessment.state.domains[0].items[3].confidential).toBe(false);
          wrapper.instance().handleUpdateItemConfidentiality('EXPOSURE', true);
          const newAssessment = cloneDeep(assessment);
          newAssessment.state.domains[0].items[3].confidential = true;
          expect(mockFn).toHaveBeenCalledWith(newAssessment);
        });

        it('is invoked when item confidentiality is updated for caregiver domain', () => {
          // given
          const mockFn = jest.fn();
          const initialAssessment = cloneDeep(assessment);
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0]);
          const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />);

          // when
          expect(initialAssessment.state.domains[0].items[3].confidential).toBe(false);
          wrapper.instance().handleUpdateItemConfidentiality('EXPOSURE', true, 'a');

          // then
          const updatedAssessment = cloneDeep(assessment);
          updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0]);
          updatedAssessment.state.domains[0].items[3].confidential = true;
          expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
        });
      });
    });
  });

  describe('#updateCaregiverName()', () => {
    describe('onUpdateAssessment call back', () => {
      it('is invoked when caregiver name is updated', () => {
        // given
        const mockFn = jest.fn();
        const initialAssessment = cloneDeep(assessment);
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0]);
        const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />);
        expect(initialAssessment.state.domains[0].caregiver_name).toBeUndefined();

        // when
        wrapper.instance().updateCaregiverName('a', 'New Name');

        // then
        const updatedAssessment = cloneDeep(assessment);
        updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0]);
        updatedAssessment.state.domains[0].caregiver_name = 'New Name';
        expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
      });
    });
  });

  describe('caregiver domain', () => {
    it('adds caregiver domain', () => {
      // given
      const initialAssessment = cloneDeep(assessment);
      initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0]);
      const mockFn = jest.fn();
      const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />);
      const instance = wrapper.instance();

      // when
      instance.addCaregiverDomainAfter('a');

      // then
      const updatedAssessment = mockFn.mock.calls[0][0];
      expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index)).toEqual(['a', 'b']);
    });

    it('removes the caregiver domain and resets the caregiver indexes', () => {
      // given
      const initialAssessment = cloneDeep(assessment);
      initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0]);
      initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'b' });
      initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'c' });
      const mockFn = jest.fn();
      const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />);
      const instance = wrapper.instance();

      // when
      instance.removeCaregiverDomain('b');

      // then
      const updatedAssessment = mockFn.mock.calls[0][0];
      expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index)).toEqual(['a', 'b']);
    });
  });
});
