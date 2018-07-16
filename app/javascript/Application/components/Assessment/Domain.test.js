import React from 'react';
import { shallow, mount } from 'enzyme';
import Domain from './Domain';

const domainDefault = {
  id: '1',
  class: 'domain',
  code: 'BEHEMO',
  under_six: true,
  above_six: false,
  items: [
    {
      under_six_id: '',
      above_six_id: '1',
      code: '1',
      required: true,
      confidential: false,
      rating_type: 'REGULAR',
      rating: -1,
    },
  ],
};

const i18nDefault = {
  _title_: 'Title',
  _description_: 'Description',
};

const domainComponentDefault = (
  <Domain
    key={'1'}
    domain={{ ...domainDefault }}
    assessmentUnderSix={true}
    i18n={{ ...i18nDefault }}
    i18nAll={{ a: 'b' }}
    onRatingUpdate={() => {}}
    onConfidentialityUpdate={() => {}}
    onAddCaregiverDomain={() => {}}
    onRemoveCaregiverDomain={() => {}}
    onCaregiverNameUpdate={() => {}}
  />
);

describe('<Domain />', () => {
  it('renders with no exceptions', () => {
    expect(() => shallow(domainComponentDefault)).not.toThrow();
  });

  describe('caregiver domain', () => {
    it('renders caregiver index and caregiver control buttons', () => {
      const domain = {
        ...domainDefault,
        is_caregiver_domain: true,
        caregiver_index: 'a',
      };
      const domainComponent = (
        <Domain
          key={'1'}
          domain={{ ...domain }}
          assessmentUnderSix={true}
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          onRemoveCaregiverDomain={() => {}}
          onCaregiverNameUpdate={() => {}}
        />
      );
      const wrapper = mount(domainComponent);
      const foldedText = wrapper.text();
      expect(foldedText).toMatch(/TITLE/);
      expect(foldedText).toMatch(/- REMOVE CAREGIVER/);
      expect(foldedText).toMatch(/\+ ADD CAREGIVER/);
    });

    it('invokes onAddCaregiverDomain() callback', () => {
      const domain = {
        ...domainDefault,
        is_caregiver_domain: true,
        caregiver_index: 'a',
      };
      const callbackMock = jest.fn();
      const domainComponent = (
        <Domain
          key={'1'}
          domain={{ ...domain }}
          assessmentUnderSix={true}
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={callbackMock}
          onRemoveCaregiverDomain={() => {}}
          onCaregiverNameUpdate={() => {}}
        />
      );
      const wrapper = mount(domainComponent);
      const addCaregiverButton = wrapper.find('.caregiver-control').at(1);
      addCaregiverButton.simulate('click');
      addCaregiverButton.simulate('keypress', { key: 'Enter' });
      addCaregiverButton.simulate('keypress', { key: 'Space' });
      expect(callbackMock.mock.calls.length).toBe(2);
    });

    it('invokes onRemoveCaregiverDomain() callback', () => {
      const domain = {
        ...domainDefault,
        is_caregiver_domain: true,
        caregiver_index: 'a',
      };
      const callbackMock = jest.fn();
      const domainComponent = (
        <Domain
          key={'1'}
          domain={{ ...domain }}
          assessmentUnderSix={true}
          i18n={{ ...i18nDefault }}
          i18nAll={{}}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
          onAddCaregiverDomain={() => {}}
          onRemoveCaregiverDomain={callbackMock}
          onCaregiverNameUpdate={() => {}}
        />
      );
      const wrapper = mount(domainComponent);
      const removeCaregiverButton = wrapper.find('.caregiver-control').at(0);
      removeCaregiverButton.simulate('click');
      removeCaregiverButton.simulate('keypress', { key: 'Enter' });
      removeCaregiverButton.simulate('keypress', { key: 'Space' });
      expect(callbackMock.mock.calls.length).toBe(2);
    });

    describe('caregiver name', () => {
      describe('#handleCaregiverNameUpdate()', () => {
        describe('when caregiver name is changed', () => {
          it('updates domain header with the updated name', () => {
            // given
            const domain = {
              ...domainDefault,
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: undefined,
            };
            const domainComponent = (
              <Domain
                key={'1'}
                domain={{ ...domain }}
                assessmentUnderSix={true}
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                onRemoveCaregiverDomain={() => {}}
                onCaregiverNameUpdate={() => {}}
              />
            );
            const wrapper = mount(domainComponent);
            const nameInput = wrapper.find('.caregiver-name').at(0);

            // when
            nameInput.simulate('change', { target: { value: 'Full Name' } });

            // then
            expect(wrapper.state('caregiverName')).toEqual('Full Name');
            expect(wrapper.find('ExpansionPanelSummary').text()).toMatch(/Full Name/);
          });
        });

        describe('when caregiver name input blurs', () => {
          it('invokes onCaregiverNameUpdate() callback', () => {
            // given
            const domain = {
              ...domainDefault,
              is_caregiver_domain: true,
              caregiver_index: 'a',
              caregiver_name: undefined,
            };
            const callbackMock = jest.fn();
            const domainComponent = (
              <Domain
                key={'1'}
                domain={{ ...domain }}
                assessmentUnderSix={true}
                i18n={{ ...i18nDefault }}
                i18nAll={{}}
                onRatingUpdate={() => {}}
                onConfidentialityUpdate={() => {}}
                onAddCaregiverDomain={() => {}}
                onRemoveCaregiverDomain={() => {}}
                onCaregiverNameUpdate={callbackMock}
              />
            );
            const wrapper = mount(domainComponent);
            const nameInput = wrapper.find('.caregiver-name').at(0);
            nameInput.simulate('change', { target: { value: 'Full Name' } });

            // when
            nameInput.simulate('blur');

            // then
            expect(callbackMock.mock.calls.length).toBe(1);
            expect(callbackMock.mock.calls[0][0]).toBe('a');
            expect(callbackMock.mock.calls[0][1]).toBe('Full Name');
          });
        });
      });
    });
  });
});
