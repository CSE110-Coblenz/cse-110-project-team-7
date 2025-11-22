// __mocks__/konva.js
const mockNode = class {
  constructor(config = {}) {
    this.attrs = config;
    this.children = [];
  }
  add(child) {
    this.children.push(child);
  }
  destroy() {}
  on() {}
  off() {}
  toJSON() {
    return JSON.stringify(this.attrs);
  }
};

class Group extends mockNode {}
class Text extends mockNode {}
class Rect extends mockNode {}
class Circle extends mockNode {}
class Layer extends mockNode {}
class Stage extends mockNode {
  constructor(config) {
    super(config);
    this.container = () => config.container;
  }
}

// Export only what you need from Konva in your files
module.exports = {
  Group,
  Text,
  Rect,
  Circle,
  Layer,
  Stage,
  Node: mockNode,
};
