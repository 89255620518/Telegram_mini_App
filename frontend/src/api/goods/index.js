export class GoodsAPI {
  constructor(httpClient) {
    this.api = httpClient;
  }

  getAll() {
    return this.api.get('/goods/');
  }

  getById(id) {
    return this.api.get(`/goods/${id}/`);
  }

  create(data) {
    return this.api.post('/goods/', data);
  }

  update(id, data) {
    return this.api.put(`/goods/${id}/`, data);
  }

  delete(id) {
    return this.api.delete(`/goods/${id}/`);
  }

  addFavorite(id) {
    return this.api.post(`/goods/${id}/favorite/`);
  }

  removeFavorite(id) {
    return this.api.delete(`/goods/${id}/favorite/`);
  }

  // Reservations
  getReservations() {
    return this.api.get('/reservations/');
  }

  getReservation(id) {
    return this.api.get(`/reservations/${id}/`);
  }

  createReservation(data, token) {
    return this.api.post('/reservations/', data, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
  }

  updateReservation(id, data) {
    return this.api.put(`/reservations/${id}/`, data);
  }

  deleteReservation(id) {
    return this.api.delete(`/reservations/${id}/`);
  }
}