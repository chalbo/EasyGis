const EventEmitter = require('eventemitter3');

class Base extends EventEmitter {
  constructor() {
    super();
  }
}

Base.event = new Base();

export default Base;
