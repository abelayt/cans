import React from 'react';
import { mount, shallow } from 'enzyme';
import Item from './Item';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const itemDefault = {
  code: 'lf10family',
  under_six_id: 1,
  above_six_id: 101,
  required: true,
  confidential: true,
  confidential_by_default: true,
  rating_type: 'REGULAR',
  has_na_option: false,
  rating: '-1',
};

const i18nDefault = {
  _title_: 'Title',
  _description_: 'Description',
  '_to_consider_.0': 'qtc 0',
  '_to_consider_.1': 'qtc 1',
  '_rating_.0': 'rating 0 description',
  '_rating_.1': 'rating 1 description',
  '_rating_.2': 'rating 2 description',
  '_rating_.3': 'rating 3 description',
};

const propsDefault = { i18n: i18nDefault };

const itemComponentDefault = (
  <Item
    key={'1'}
    item={{ ...itemDefault }}
    assessmentUnderSix={true}
    i18n={{ ...i18nDefault }}
    onRatingUpdate={() => {}}
    onConfidentialityUpdate={() => {}}
  />
);

const mountItem = item => {
  return mount(
    <Item
      key={'1'}
      item={item}
      assessmentUnderSix={false}
      i18n={{ ...i18nDefault }}
      onRatingUpdate={() => {}}
      onConfidentialityUpdate={() => {}}
    />
  );
};

describe('<Item />', () => {
  it('can expand and fold', () => {
    const wrapper = mount({ ...itemComponentDefault });
    wrapper.setProps({ ...propsDefault });
    const foldedText = wrapper.text();
    expect(wrapper.find('#item-expand').hasClass('fa-plus')).toBe(true);
    expect(foldedText).not.toMatch(/Description/);

    wrapper.find('#item-expand').simulate('click');
    const expandedText = wrapper.text();
    expect(wrapper.find('#item-expand').hasClass('fa-minus')).toBe(true);
    expect(expandedText).toMatch(/Description/);
  });

  it('has a title, description, questions to consider and rating descriptions ', async () => {
    const wrapper = mount({ ...itemComponentDefault });
    wrapper.setProps({ ...propsDefault });
    const foldedText = wrapper.text();
    expect(foldedText).toMatch(/TITLE/);
    expect(foldedText).not.toMatch(/Description/);
    expect(foldedText).not.toMatch(/qtc/);
    expect(foldedText).not.toMatch(/rating/);

    wrapper.find('#item-expand').simulate('click');
    const expandedText = wrapper.text();
    expect(expandedText).toMatch(/TITLE/);
    expect(expandedText).toMatch(/Description:Description/);
    expect(expandedText).toMatch(/qtc 0qtc 1/);
    expect(expandedText).toMatch(
      /0 = rating 0 description1 = rating 1 description2 = rating 2 description3 = rating 3 description/
    );
  });

  it('renders caregiver index if it exists', async () => {
    const wrapper = mount({ ...itemComponentDefault });
    wrapper.setProps({
      ...propsDefault,
      caregiverIndex: 'a',
    });
    const foldedText = wrapper.text();
    expect(foldedText).toMatch(/1a\. /);
  });

  describe('N/A option', () => {
    it('can have N/A option', () => {
      const item = { ...itemDefault };
      item.has_na_option = true;
      const wrapper = mountItem(item);
      wrapper.setProps({ ...propsDefault });
      wrapper.find('#item-expand').simulate('click');
      const expandedText = wrapper.text();
      expect(expandedText).toMatch(/N\/A/);
      const radios = wrapper.find(Radio);
      expect(radios.length).toBe(5);
    });

    it('can have no N/A option', () => {
      const wrapper = mount({ ...itemComponentDefault });
      wrapper.setProps({ ...propsDefault });
      wrapper.find('#item-expand').simulate('click');
      const expandedText = wrapper.text();
      expect(expandedText).not.toMatch(/N\/A/);
      const radios = wrapper.find(Radio);
      expect(radios.length).toBe(4);
    });
  });

  describe('Rating Types', () => {
    it('can have Regular rating', () => {
      const wrapper = mount({ ...itemComponentDefault });
      wrapper.setProps({ ...propsDefault });
      const findSelect = wrapper.find(Select);
      expect(findSelect.children().get(0).props.children.length).toBe(6);

      wrapper.find('#item-expand').simulate('click');
      const expandedText = wrapper.text();
      expect(expandedText).toMatch(/0 = rating 0 description1 = rating 1 description/);
    });

    it('can have Boolean rating', () => {
      const item = { ...itemDefault };
      item.rating_type = 'BOOLEAN';
      const wrapper = mountItem(item);
      wrapper.setProps({ ...propsDefault });
      const findSelect = wrapper.find(Select);
      expect(findSelect.children().get(0).props.children.length).toBe(4);

      wrapper.find('#item-expand').simulate('click');
      const expandedText = wrapper.text();
      expect(expandedText).toMatch(/No = rating 0 descriptionYes = rating 1 description/);
    });
  });

  describe('Actions', () => {
    it('invokes onRatingUpdate callback on rating change', () => {
      const onRatingUpdateMock = jest.fn();
      const wrapper = shallow(
        <Item
          key={'1'}
          item={{ ...itemDefault }}
          assessmentUnderSix={false}
          i18n={{ ...i18nDefault }}
          onRatingUpdate={onRatingUpdateMock}
          onConfidentialityUpdate={() => {}}
        />
      );
      wrapper.setProps({ ...propsDefault });
      wrapper.instance().handleRatingChange({ target: {} });
      expect(onRatingUpdateMock.mock.calls.length).toBe(1);
    });

    it('invokes onConfidentialityUpdate callback on confidentiality change', () => {
      const onConfidentialityUpdateMock = jest.fn();
      const wrapper = shallow(
        <Item
          key={'1'}
          item={{ ...itemDefault }}
          assessmentUnderSix={false}
          i18n={{ ...i18nDefault }}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={onConfidentialityUpdateMock}
        />
      );
      wrapper.setProps({ ...propsDefault });
      wrapper.instance().handleConfidentialityChange({ target: {} });
      expect(onConfidentialityUpdateMock.mock.calls.length).toBe(1);
    });

    it('converts newValue to a number', () => {
      const onRatingUpdateMock = jest.fn();
      const wrapper = mount(
        <Item
          key={'1'}
          item={{ ...itemDefault }}
          assessmentUnderSix={false}
          i18n={{ ...i18nDefault }}
          onRatingUpdate={onRatingUpdateMock}
          onConfidentialityUpdate={() => {}}
        />
      );
      const stringValue = { target: { value: '1' } };

      wrapper.setProps({ ...propsDefault });
      wrapper.instance().handleRatingChange(stringValue);

      // the string "1" was converted to a 1
      expect(onRatingUpdateMock).toBeCalledWith('lf10family', 1, undefined);
    });
  });

  describe('canReleaseConfidentialInfo', () => {
    it('should disable the confidential checkbox when false paired with an item thats confidential_by_default', () => {
      const wrapper = shallow(
        <Item
          assessmentUnderSix={false}
          item={{ ...itemDefault }}
          i18n={{ ...i18nDefault }}
          canReleaseConfidentialInfo={false}
          onRatingUpdate={() => {}}
          onConfidentialityUpdate={() => {}}
        />
      );
      expect(
        wrapper
          .find(FormControlLabel)
          .dive()
          .dive()
          .find(Checkbox)
          .prop('disabled')
      ).toEqual(true);
    });
  });
});
