import React from 'react';
import { shallow, mount } from 'enzyme';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader/index';
import CardContent from '@material-ui/core/CardContent/index';
import Grid from '@material-ui/core/Grid/Grid';
import { Link, MemoryRouter } from 'react-router-dom';
import { ClientAssessmentHistory } from './index';
import AssessmentService from '../Assessment/Assessment.service';

jest.mock('../Assessment/Assessment.service');

const assessmentInProgress = {
  id: 97501,
  person: { id: 1 },
  status: 'IN_PROGRESS',
  event_date: '2015-10-10',
  updated_timestamp: '2015-06-06T15:37:32.000Z',
  updated_by: {
    first_name: 'Name 1',
    last_name: 'LastName 1',
  },
};

const assessmentSubmitted = {
  id: 97502,
  person: { id: 1 },
  status: 'SUBMITTED',
  event_date: '2018-01-05',
  updated_timestamp: '2018-06-06T15:37:32.000Z',
  updated_by: {
    first_name: 'Name 2',
    last_name: 'LastName 2',
  },
};

const assessmentWithNoUpdateInfo = {
  id: 97503,
  person: { id: 1 },
  status: 'IN_PROGRESS',
  event_date: '2018-01-05',
  created_timestamp: '2018-06-06T15:37:32.000Z',
  created_by: {
    first_name: 'Name 3',
    last_name: 'LastName 3',
  },
};

const getShallowWrapper = () => shallow(<ClientAssessmentHistory clientId={1004} />);

const prepareWrapper = async mockedAssessments => {
  // given
  AssessmentService.search.mockReturnValue(Promise.resolve(mockedAssessments));
  const wrapper = getShallowWrapper();

  // when
  await wrapper.instance().UNSAFE_componentWillReceiveProps({ clientId: 1004 });
  wrapper.update();
  return wrapper;
};

describe('<ClientAssessmentHistory', () => {
  describe('components', () => {
    const getLength = component => getShallowWrapper().find(component).length;

    it('renders with 1 <Grid /> component', () => {
      expect(getLength(Grid)).toBe(1);
    });

    it('renders with 1 <Card /> component', () => {
      expect(getLength(Card)).toBe(1);
    });

    it('renders with 1 <CardHeader /> component', () => {
      expect(getLength(CardHeader)).toBe(1);
    });

    it('renders with <CardContent /> component', () => {
      expect(getLength(CardContent)).toBe(1);
    });

    it('renders with <Link /> that navigates to /assessments', () => {
      const wrapper = mount(
        <MemoryRouter>
          <ClientAssessmentHistory clientId={1004} />
        </MemoryRouter>
      ).find(CardHeader);
      expect(wrapper.props().action.props.to.pathname).toBe('/clients/1004/assessments');
    });
  });

  describe('assessment history', () => {
    describe('when 2 records', () => {
      it('renders 2 assessments', async () => {
        // given + when
        const wrapper = await prepareWrapper([assessmentInProgress, assessmentSubmitted]);

        // then
        expect(wrapper.find('.history-item').length).toBe(2);
      });
    });

    describe('when 1 record', () => {
      it('renders IN_PROGRESS assessment with all fields', async () => {
        // given + when
        const wrapper = await prepareWrapper([assessmentInProgress]);

        // then
        expect(wrapper.find('.locked-icon').length).toEqual(0);
        expect(wrapper.find('.unlocked-icon').length).toEqual(1);
        expect(
          wrapper
            .find(Link)
            .children()
            .text()
        ).toEqual('10/10/2015 CANS');
        const timestamp = wrapper.find('.item-timestamp').get(0).props.children;
        expect(timestamp).toEqual('Saved on 6/6/2015 by Name 1 LastName 1');
      });

      it('renders SUBMITTED assessment with all fields', async () => {
        // given + when
        const wrapper = await prepareWrapper([assessmentSubmitted]);

        // then
        expect(wrapper.find('.locked-icon').length).toEqual(1);
        expect(wrapper.find('.unlocked-icon').length).toEqual(0);
        expect(
          wrapper
            .find(Link)
            .children()
            .text()
        ).toEqual('1/5/2018 CANS');
        const timestamp = wrapper.find('.item-timestamp').get(0).props.children;
        expect(timestamp).toEqual('Submitted on 6/6/2018 by Name 2 LastName 2');
      });

      it('renders assessment with no update info (create info only)', async () => {
        // given + when
        const wrapper = await prepareWrapper([assessmentWithNoUpdateInfo]);

        // then
        const timestamp = wrapper.find('.item-timestamp').get(0).props.children;
        expect(timestamp).toEqual('Saved on 6/6/2018 by Name 3 LastName 3');
      });
    });

    describe('when 0 records', () => {
      it('renders the empty message', async () => {
        // given + when
        const wrapper = await prepareWrapper([]);

        // then
        const message = wrapper.find('#no-data').text();
        expect(message).toBe('No assessments currently exist for this child/youth.');
      });
    });

    describe('submit success message', () => {
      it('is rendered when needed', () => {
        // given + when
        const history = shallow(
          <ClientAssessmentHistory clientId={1004} location={{ state: { successAssessmentId: 123 } }} />
        );

        // then
        const alert = history.find('CloseableAlert');
        expect(alert.length).toBe(1);
        expect(alert.render().text()).toBe('Success! CANS assessment has been submitted.');
      });

      it('is not rendered when no successAssessmentId', () => {
        // given + when
        const history = shallow(<ClientAssessmentHistory clientId={1004} />);

        // then
        expect(history.find('CloseableAlert').length).toBe(0);
      });

      it('is not rendered on page reload', () => {
        // given
        const browserHistory = [{ state: { successAssessmentId: 123 } }];
        browserHistory.replace = function(newLocation) {
          this.pop();
          this.push(newLocation);
        };

        // when
        const assessmentHistory1 = shallow(
          <ClientAssessmentHistory clientId={1004} location={browserHistory[0]} history={browserHistory} />
        );
        expect(assessmentHistory1.find('CloseableAlert').length).toBe(1);
        const assessmentHistory2 = shallow(
          <ClientAssessmentHistory clientId={1004} location={browserHistory[0]} history={browserHistory} />
        );

        // then
        expect(assessmentHistory2.find('CloseableAlert').length).toBe(0);
      });
    });
  });
});
