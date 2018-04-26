import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM();
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);

// Setup adapter to work with enzyme
Enzyme.configure({ adapter: new Adapter() });

// Ignore React Web errors when using React Native
console.error = message => message;

require('react-native-mock-render/mock');
