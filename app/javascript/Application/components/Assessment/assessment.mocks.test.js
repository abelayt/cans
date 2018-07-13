import { DateTime } from 'luxon';
import { childInfoJson } from '../Client/person.helper.test';

export const initialAssessment = {
  instrument_id: 1,
  person: childInfoJson,
  assessment_type: 'INITIAL',
  status: 'IN_PROGRESS',
  completed_as: 'COMMUNIMETRIC',
  can_release_confidential_info: false,
  state: {
    id: 0,
    under_six: false,
    domains: [
      {
        id: 0,
        code: 'string',
        underSix: false,
        aboveSix: false,
      },
    ],
  },
  event_date: DateTime.local().toISODate(),
};

export const assessment = {
  id: 1,
  instrument_id: 1,
  person: childInfoJson,
  assessment_type: 'INITIAL',
  status: 'IN_PROGRESS',
  completed_as: 'COMMUNIMETRIC',
  can_release_confidential_info: false,
  state: {
    under_six: false,
    caregiver_domain_template: {
      id: '6',
      code: 'CGV',
      is_caregiver_domain: true,
      items: [
        {
          code: '1',
        },
      ],
    },
    domains: [
      {
        id: 0,
        code: '123',
        items: [
          {
            above_six_id: '1',
            code: '1',
            confidential: false,
            confidential_by_default: false,
            rating: 1,
            rating_type: 'REGULAR',
            required: true,
            under_six_id: 'EC01',
          },
          {
            above_six_id: '2',
            code: 'SUBSTANCE_USE',
            confidential: false,
            confidential_by_default: false,
            rating: 1,
            rating_type: 'REGULAR',
            required: true,
            under_six_id: 'EC01',
          },
          {
            above_six_id: '2',
            code: 'SUBSTANCE_USE_CAREGIVER',
            confidential: false,
            confidential_by_default: false,
            rating: 1,
            rating_type: 'REGULAR',
            required: true,
            under_six_id: 'EC01',
          },
          {
            above_six_id: '2',
            code: 'EXPOSURE',
            confidential: false,
            confidential_by_default: true,
            rating: 1,
            rating_type: 'REGULAR',
            required: true,
            under_six_id: 'EC01',
          },
        ],
        underSix: true,
        aboveSix: true,
      },
    ],
  },
  event_date: '2018-06-11',
};

export const updatedAssessment = {
  id: 1,
  instrument_id: 1,
  person: childInfoJson,
  assessment_type: 'INITIAL',
  status: 'IN_PROGRESS',
  completed_as: 'COMMUNIMETRIC',
  can_release_confidential_info: false,
  state: {
    id: 0,
    under_six: true,
    domains: [
      {
        id: 0,
        code: '456',
        underSix: false,
        aboveSix: true,
      },
      {
        id: 1,
        code: '780',
        underSix: false,
        aboveSix: true,
      },
    ],
  },
  event_date: '2018-06-11',
};

export const instrument = {
  id: 1,
  prototype: {
    id: 0,
    under_six: false,
    domains: [
      {
        id: 0,
        code: 'string',
        underSix: false,
        aboveSix: false,
      },
    ],
  },
};

export const i18n = {
  '10._description_': 'Child youth relationship',
  '10._rating_.1._description_': 'Identified need requires monitoring',
  '10._rating_.2._description_': 'Action or intervention is required',
  '10._rating_.3._description_': 'Problems are dangerous',
};

export const client = {
  first_name: 'John',
  last_name: 'Doe',
};
