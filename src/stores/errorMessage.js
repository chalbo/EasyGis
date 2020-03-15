
import { observable, action } from 'mobx';

class ErrorMessage {
  @observable hasError = false;

  @observable message;

  @action set(hasError, message) {
    this.hasError = hasError;
    this.message = message;
  }

  @action reset() {
    this.hasError = false;
    // eslint-disable-next-line no-void
    this.message = void 0;
  }
}

const self = new ErrorMessage();
export default self;
