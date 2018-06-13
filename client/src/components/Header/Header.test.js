import React from 'react';
import { mount } from 'enzyme';
import Header from './Header';

jest.mock('./UserAccountService');
const UserAccountService = require('./UserAccountService').default;

describe('Header', () => {
  describe('when logged in', () => {
    // it('shows user name', async () => {
    //   UserAccountService.fetchCurrent.mockReturnValue(
    //     Promise.resolve({
    //       first_name: 'John',
    //       last_name: 'Doe',
    //     })
    //   );
    //   const wrapper = await mount(<Header />);
    //   const displayedUserName = wrapper
    //     .find('.profile')
    //     .text()
    //     .trim();
    //   expect(displayedUserName).toBe('John Doe');
    // });

    // it('shows user initials', async () => {
    //   UserAccountService.fetchCurrent.mockReturnValue(
    //     Promise.resolve({
    //       first_name: 'Joanna',
    //       last_name: 'Doe',
    //       any_field: 'Any value'
    //     })
    //   );
    //   const wrapper = await mount(<Header />);
    //   const displayedUserInitials = wrapper
    //     .find('.profile-avatar')
    //   .text()
    //     .trim();
    //   expect(displayedUserInitials).toBe('JD');
    // });

    it('invokes callback', async () => {
      const mockCallback = jest.fn();
      UserAccountService.fetchCurrent.mockReturnValue(
        Promise.resolve({
          staff_id: 'id',
        })
      );
      await mount(<Header onUserFetchedCallback={mockCallback} />);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toBe('id');
    });
  });

  describe('when failed to fetch user', () => {
    // it('shows empty user name', async () => {
    //   UserAccountService.fetchCurrent.mockReturnValue(
    //     Promise.reject(new Error('e'))
    //   );
    //   const wrapper = await mount(<Header />);
    //   const displayedUserName = wrapper
    //     .find('.profile')
    //     .text()
    //     .trim();
    //   expect(displayedUserName).toBe('');
    // });

    it('does not invoke callback', async () => {
      UserAccountService.fetchCurrent.mockReturnValue(
        Promise.reject(new Error('e'))
      );
      const mockCallback = jest.fn();
      await mount(<Header onUserFetchedCallback={mockCallback} />);
      expect(mockCallback.mock.calls.length).toBe(0);
    });
  });
});
