import { AssessmentService } from './Assessment.service';
import appApi from '../../App.api';

jest.mock('../../App.api');

describe('AssessmentService', () => {
  describe('#fetch', () => {
    const apiGetSpy = jest.spyOn(appApi, 'get');

    beforeEach(() => {
      apiGetSpy.mockReset();
    });

    it('returns assessment', async () => {
      const assessmentId = 50000;
      const expectedAssessment = { id: assessmentId };
      apiGetSpy.mockReturnValue(Promise.resolve({ data: expectedAssessment }));
      const actualAssessment = await AssessmentService.fetch(assessmentId);
      expect(actualAssessment).toBe(expectedAssessment);
      expect(apiGetSpy).toHaveBeenCalledTimes(1);
      expect(apiGetSpy).toHaveBeenCalledWith(`/assessments/${assessmentId}`);
    });
  });

  describe('#search', () => {
    const apiPostSpy = jest.spyOn(appApi, 'post');

    it('returns assessments', async () => {
      const expected = [{ id: '1' }, { id: '2' }];
      apiPostSpy.mockReturnValue(Promise.resolve({ data: expected }));
      const actual = await AssessmentService.search({});
      expect(actual).toBe(expected);
      expect(apiPostSpy).toHaveBeenCalledTimes(1);
      expect(apiPostSpy).toHaveBeenCalledWith('/assessments/_search', {});
    });
  });
});
