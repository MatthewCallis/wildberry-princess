import test from 'ava';
import sinon from 'sinon';
import WildberryPrincess from '../src/wildberry-princess';

let wbp;
let button;

test.beforeEach((_t) => {
  button = document.createElement('button');
  button.textConent = 'First Button';
  button.setAttribute('data-event-label', 'First Button');
  document.body.appendChild(button);

  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  sinon.spy(window, 'ga');
  sinon.spy(window._kmq, 'push');
  wbp = new WildberryPrincess();
});

test.afterEach((_t) => {
  button.parentNode.removeChild(button);

  window.ga.restore();
  window._kmq.push.restore();
});

test('#trackUserActions: should add data and click handlers to the elements', (t) => {
  const wbp_spy = sinon.spy(wbp, 'trackUserActions');
  wbp.trackUserActions('button', 'Buttons');
  t.is(wbp_spy.callCount, 1);
  const event_data = document.querySelector('button').data;
  t.true({}.hasOwnProperty.call(event_data, 'eventParams'));
  t.deepEqual(Object.keys(event_data.eventParams), ['category', 'action']);
});

test('#trackUserActions: should add label and value data when supplied', (t) => {
  const wbp_spy = sinon.spy(wbp, 'trackUserActions');
  wbp.trackUserActions('button', 'Buttons', 'Click', 'Label', 1);
  t.is(wbp_spy.callCount, 1);
  const event_data = document.querySelector('button').data;
  t.true({}.hasOwnProperty.call(event_data, 'eventParams'));
  t.deepEqual(Object.keys(event_data.eventParams), ['category', 'action', 'label', 'value']);
});
