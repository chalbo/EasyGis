
import _axios from 'axios';
import errorMessage from '../stores/errorMessage';

const instance = _axios.create({
  baseURL: 'http://127.0.0.11:8080/api',
});

instance.interceptors.request.use(
  null,
  (error) => {
    console.log(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if (response.status >= 500) {
      errorMessage.set(true, 'Server error, please try later.');
    } else if (response.data.err) {
      errorMessage.set(true, response.data.err.message);
    }

    return response;
  },
  (error) => {
    errorMessage.set(true, error.message);
  },
);

export default instance;
