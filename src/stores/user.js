
import { observable, action } from 'mobx';
import api from 'utils/api';

class User {
  @observable loading = true;

  @observable data = {};

  @observable favorite = [];

  @action async query(id) {
    this.loading = true;

    const response = await api.get(`/user/${id}`);
    const { data } = response;

    this.data = data;
    this.loading = false;
  }

  @action async getFavorite(id) {
    const response = await api.get(`/list/favorite/${id}`);
    const { data } = response;

    this.favorite = data;
  }
}

const self = new User();
export default self;
