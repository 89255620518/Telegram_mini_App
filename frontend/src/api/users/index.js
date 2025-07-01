export class UsersAPI {
  constructor(httpClient) {
    this.api = httpClient;
  }

  register(data) {
    return this.api.post('/users/', data);
  }

  login(credentials) {
    return this.api.post('/auth/token/login/', credentials);
  }

  logout() {
    return this.api.post('/auth/token/logout/');
  }

  getMe() {
    return this.api.get('/users/me/');
  }

  updateMe(data) {
    return this.api.put('/users/me/', data);
  }

  sendOrder(data) {
    return this.api.post('/users/send-order/', data);
  }

  sendPreorder(data) {
    return this.api.post('/users/send-preorder/', data);
  }

  sendBanquet(data) {
    return this.api.post('/users/send-banquet/', data);
  }

  sendHookah(data) {
    return this.api.post('/users/send-hookah/', data);
  }

  processPayment(data) {
    return this.api.post('/users/payment/', data);
  }

  callTaxi(data) {
    return this.api.post('/users/send-taxi/', data);
  }
}