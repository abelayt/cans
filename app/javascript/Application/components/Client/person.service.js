import appApi from '../../App.api';

class PersonService {
  static fetch(id) {
    return appApi.get(`/people/${id}`).then(response => response.data);
  }

  static fetchAllClients() {
    const data = {
      person_role: 'CLIENT',
    };
    return appApi.post('/people/_search', data).then(response => {
      return response.data;
    });
  }
  static postClient(clientId) {
    return appApi.post(`/people`, clientId).then(response => response.data);
  }
}

export default PersonService;
