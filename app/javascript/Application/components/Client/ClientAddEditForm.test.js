import React from 'react';
import { shallow, mount } from 'enzyme';
import ClientAddEditForm from './ClientAddEditForm';
import { ClientService } from './Client.service';
import { childInfoJson } from './Client.helper.test';
import { MemoryRouter } from 'react-router-dom';

const defaultPropsEdit = {
  match: { params: { id: 1 } },
};

const defaultPropsAdd = {
  match: { params: { id: undefined } },
};
describe('<ClientAddEditForm />', () => {
  const getWrapperMountAdd = () =>
    mount(
      <MemoryRouter>
        <ClientAddEditForm {...defaultPropsAdd} />
      </MemoryRouter>
    );
  const getWrapperMountEdit = () =>
    mount(
      <MemoryRouter>
        <ClientAddEditForm {...defaultPropsEdit} />
      </MemoryRouter>
    );
  const getWrapperAdd = () => shallow(<ClientAddEditForm {...defaultPropsAdd} />);
  const getWrapperEdit = () => shallow(<ClientAddEditForm {...defaultPropsEdit} />);

  describe('When isNewForm is true', () => {
    it('validates the form inputs are false', () => {
      const wrapper = getWrapperAdd();
      const wrapperMount = getWrapperMountAdd();
      const addWrapper = wrapper.find('ClientAddEditForm').dive();
      const addWrapperMount = wrapperMount.find('PageInfo').first();
      expect(addWrapperMount.exists()).toBe(true);
      expect(addWrapper.state('isNewForm')).toEqual(true);
      expect(addWrapper.state('childInfoValidation').first_name).toEqual(false);
      expect(addWrapper.state('childInfoValidation').last_name).toEqual(false);
      expect(addWrapper.state('childInfoValidation').dob).toEqual(false);
      expect(addWrapper.state('childInfoValidation').external_id).toEqual(false);
      expect(addWrapper.state('childInfoValidation').county).toEqual(false);
      expect(addWrapper.state('childInfoValidation').cases[0].external_id).toEqual(true);
      expect(addWrapper.state('isSaveButtonDisabled')).toEqual(true);
      expect(addWrapperMount.prop('title')).toBe('Add Child/Youth');
    });
  });

  describe('When isNewForm is false', () => {
    it('validates the form is populated', () => {
      const wrapper = getWrapperEdit();
      const wrapperMount = getWrapperMountEdit();
      const editWrapper = wrapper.find('ClientAddEditForm').dive();
      const editWrapperMount = wrapperMount.find('PageInfo').first();
      expect(editWrapperMount.exists()).toBe(true);

      expect(editWrapper.state('isNewForm')).toEqual(false);
      expect(editWrapper.state('childInfoValidation').first_name).toEqual(true);
      expect(editWrapper.state('childInfoValidation').last_name).toEqual(true);
      expect(editWrapper.state('childInfoValidation').dob).toEqual(true);
      expect(editWrapper.state('childInfoValidation').external_id).toEqual(true);
      expect(editWrapper.state('childInfoValidation').county).toEqual(true);
      expect(editWrapper.state('childInfoValidation').cases[0].external_id).toEqual(true);
      expect(editWrapper.state('isSaveButtonDisabled')).toEqual(false);
      expect(editWrapperMount.prop('title')).toBe('Edit Child/Youth');
    });

    it('#handleSubmit() updates and set shouldRedirect to true', async () => {
      const clientServicePutSpy = jest.spyOn(ClientService, 'updateClient');
      const wrapper = getWrapperEdit();
      const clientEditWrapper = wrapper.find('ClientAddEditForm').dive();
      clientServicePutSpy.mockReturnValue(Promise.resolve(defaultPropsEdit.match.params.id, childInfoJson));
      await clientEditWrapper.instance().handleSubmit();
      expect(clientEditWrapper.state('redirection').shouldRedirect).toBe(true);
      clientServicePutSpy.mockClear();
    });
  });

  describe('When Editing inputs:', () => {
    it('validates first_name', () => {
      const wrapper = getWrapperEdit();
      const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
      ClientEditWrapper.instance().handleChange('first_name')({
        target: { value: 'John' },
      });
    });

    it('validates last_name', () => {
      const wrapper = getWrapperEdit();
      const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
      ClientEditWrapper.instance().handleChange('last_name')({
        target: { value: 'John' },
      });
      expect(ClientEditWrapper.state('childInfoValidation').last_name).toEqual(true);
      expect(ClientEditWrapper.state('isSaveButtonDisabled')).toEqual(false);
    });

    it('validates dob', () => {
      const wrapper = getWrapperEdit();
      const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
      ClientEditWrapper.instance().handleChange('dob')({
        target: { value: '2012/10/12' },
      });
      expect(ClientEditWrapper.state('childInfoValidation').dob).toEqual(true);
      expect(ClientEditWrapper.state('isSaveButtonDisabled')).toEqual(false);
    });

    it('validates county', () => {
      const wrapper = getWrapperEdit();
      const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
      ClientEditWrapper.instance().handleChange('county')({
        target: { value: { id: '1' } },
      });
      expect(ClientEditWrapper.state('childInfoValidation').county).toEqual(true);
      expect(ClientEditWrapper.state('isSaveButtonDisabled')).toEqual(false);
    });

    it('validates cases', () => {
      const wrapper = getWrapperEdit();
      const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
      ClientEditWrapper.instance().handleChangeCaseNumber(0)({
        target: { value: '1234567890987654321' },
      });
      expect(ClientEditWrapper.state('childInfoValidation').cases[0].external_id).toEqual(true);
      expect(ClientEditWrapper.state('isSaveButtonDisabled')).toEqual(false);
    });

    it('enables Save button when all validations are good', () => {
      const wrapper = getWrapperEdit();
      const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
      const childFormInstance = ClientEditWrapper.instance();
      childFormInstance.handleChange('first_name')({
        target: { value: 'John' },
      });
      childFormInstance.handleChange('last_name')({
        target: { value: 'Max' },
      });
      childFormInstance.handleChange('external_id')({
        target: { value: '1234567891234567890' },
      });
      childFormInstance.handleChange('external_id')({
        target: { value: '1234-5678-9123-4567890' },
      });
      childFormInstance.handleChange('dob')({
        target: { value: '02/08/2002' },
      });
      childFormInstance.handleChange('county')({
        target: { value: { id: '5' } },
      });
      childFormInstance.handleChangeCaseNumber(0)({
        target: { value: '123' },
      });
      expect(ClientEditWrapper.state('isSaveButtonDisabled')).toEqual(false);
    });
  });

  describe('case numbers', () => {
    describe('#handleChangeCaseNumber()', () => {
      it('should update case external_id and validate it', () => {
        // given
        const clientForm = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive();

        // when
        clientForm.instance().handleChangeCaseNumber(0)({ target: { value: '1234' } });

        // then
        expect(clientForm.state().childInfo.cases[0].external_id).toEqual('1234');
        expect(clientForm.state().childInfoValidation.cases[0].external_id).toBeTruthy();
      });

      it('should validate duplicated case numbers', () => {
        // given
        const clientForm = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive();
        const clientFormInstance = clientForm.instance();
        clientFormInstance.handleAddCaseNumber({ type: 'click' });

        // when
        clientFormInstance.handleChangeCaseNumber(0)({ target: { value: '1234' } });
        expect(clientForm.state().childInfoValidation.cases[0].external_id).toBeTruthy();
        clientFormInstance.handleChangeCaseNumber(1)({ target: { value: '1234' } });

        // then
        clientForm.update();
        expect(clientForm.state().childInfoValidation.cases[0].external_id).toBeFalsy();
        expect(clientForm.state().childInfoValidation.cases[1].external_id).toBeFalsy();
      });
    });

    describe('#onFetchChildDataSuccess()', () => {
      it('should initialize validation object with cases', () => {
        // given
        const clientForm = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive();

        // when
        clientForm.instance().onFetchChildDataSuccess({
          cases: [{}, {}, {}],
        });
        clientForm.update();

        // then
        expect(clientForm.find('.case-numbers>TextField').length).toEqual(3);
        const expectedCasesValidation = clientForm.state().childInfoValidation.cases;
        expect(expectedCasesValidation.length).toEqual(3);
        expect(expectedCasesValidation[0]).toEqual({ external_id: true });
        expect(expectedCasesValidation[1]).toEqual({ external_id: true });
        expect(expectedCasesValidation[2]).toEqual({ external_id: true });
      });
    });

    describe('#handleAddCaseNumber()', () => {
      it('should add new empty case number and update validation object with it', () => {
        // given
        const clientForm = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive();

        // when
        clientForm.instance().handleAddCaseNumber({ type: 'click' });
        clientForm.update();

        // then
        expect(clientForm.find('.case-numbers>TextField').length).toEqual(2);
        const expectedCases = clientForm.state().childInfo.cases;
        expect(expectedCases.length).toEqual(2);
        expect(expectedCases[1]).toEqual({ external_id: '' });
        const expectedCasesValidation = clientForm.state().childInfoValidation.cases;
        expect(expectedCasesValidation.length).toEqual(2);
        expect(expectedCasesValidation[1]).toEqual({ external_id: true });
      });
    });

    describe('#prepareChildForSubmit()', () => {
      it('should remove all cases with no external_id', () => {
        // given
        const inputChildInfo = {
          cases: [{}, { external_id: '0' }, {}, { any: 'thing' }, { external_id: '1' }, {}],
        };
        const expectedChildInfo = {
          cases: [{ external_id: '0' }, { external_id: '1' }],
        };

        // when
        const actualChildInfo = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive()
          .instance()
          .prepareChildForSubmit(inputChildInfo);

        // then
        expect(actualChildInfo).toEqual(expectedChildInfo);
      });
    });
  });

  it('#handleSubmit()', async () => {
    const ClientServicePutSpy = jest.spyOn(ClientService, 'updateClient');
    const wrapper = getWrapperEdit();
    const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
    ClientServicePutSpy.mockReturnValue(Promise.resolve(childInfoJson));
    await ClientEditWrapper.instance().handleSubmit();
    expect(ClientEditWrapper.state().redirection.shouldRedirect).toBe(true);
    ClientServicePutSpy.mockClear();
  });

  it('#handleCancel()', () => {
    const wrapper = getWrapperEdit();
    const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
    ClientEditWrapper.instance().handleCancel();
    expect(ClientEditWrapper.state('redirection').shouldRedirect).toBe(true);
  });

  it('renders counties drop down', () => {
    const wrapper = getWrapperEdit();
    const ClientEditWrapper = wrapper.find('ClientAddEditForm').dive();
    const childFormInstance = ClientEditWrapper.instance();
    childFormInstance.onFetchCountiesSuccess([{ id: '9', name: 'Fresno' }]);
    ClientEditWrapper.update();
    const menuItems = ClientEditWrapper.find('MenuItem');
    expect(menuItems.children.length).toEqual(1);
  });
});
