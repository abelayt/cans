import React from 'react';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader/index';
import CardContent from '@material-ui/core/CardContent/index';
import Grid from '@material-ui/core/Grid/Grid';
import { Link } from 'react-router-dom';
import { ClientAssessmentHistory } from './index';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../Assessment/Assessment.service');
import AssessmentService from '../Assessment/Assessment.service';

const assessmentInProgress = {
  id: 97501,
  status: 'IN_PROGRESS',
  event_date: '2015-10-10',
  updated_timestamp: '2015-06-06T15:37:32.000Z',
  updated_by: {
    first_name: 'Name 1',
    last_name: 'LastName 1',
  },
};

const assessmentSubmitted = {
  id: 97501,
  status: 'SUBMITTED',
  event_date: '2018-01-05',
  updated_timestamp: '2018-06-06T15:37:32.000Z',
  updated_by: {
    first_name: 'Name 2',
    last_name: 'LastName 2',
  },
};

const getShallowWrapper = () =>
  shallow(<ClientAssessmentHistory clientId={1004} />);

const prepareWrapper = async (mockedAssessments) => {
  // given
  AssessmentService.search.mockReturnValue(Promise.resolve(mockedAssessments));
  const wrapper = getShallowWrapper();

  // when
  await wrapper.instance().componentWillReceiveProps({ clientId: 1004 });
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
      expect(wrapper.props().action.props.to.pathname).toBe('/assessments');
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
  });
});
