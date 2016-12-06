import test from 'ava';
import sinon from 'sinon';
import WildberryPrincess from '../src/wildberry-princess';

let wbp;
let key;
let value;
let kmq_spy;
let setga_spy;

test.beforeEach((_t) => {
  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  kmq_spy = sinon.spy(window._kmq, 'push');

  wbp = new WildberryPrincess();
  setga_spy = sinon.spy(wbp, 'setGA');
  key = 'my-key';
  value = 'my-value';
});

test.afterEach((_t) => {
  window._kmq.push.restore();
});

test('#identify: should not call setGA when GA is enabled without a user_ID', (t) => {
  t.is(setga_spy.callCount, 0);
  wbp.identify();
  t.is(setga_spy.callCount, 0);
});

test('#identify: should call setGA when GA is enabled with an user_id', (t) => {
  t.is(setga_spy.callCount, 0);
  wbp.identify('1234');
  t.is(setga_spy.callCount, 1);
  t.true(setga_spy.calledWith('userId', '1234'));
});

test('#identify: should not call setGA when GA is disabled', (t) => {
  wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  t.is(setga_spy.callCount, 0);
  wbp.identify(key, value);
  t.is(setga_spy.callCount, 0);
});

test('#identify: should call setKM when KM is enabled', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.identify();
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['identify', 'anonymous']));
});

test('#identify: should call setKM when KM is enabled with an user_id', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.identify('1234');
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['identify', '1234']));
});

test('#identify: should not call setKM when KM is disabled', (t) => {
  wbp = new WildberryPrincess({ useKissMetrics: false });
  t.is(kmq_spy.callCount, 0);
  wbp.identify(key, value);
  t.is(kmq_spy.callCount, 0);
});

// #clearIdentity
test('#clearIdentity: should call sendPayloadKM when KM is enabled', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.clearIdentity();
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['clearIdentity']));
});

test('#clearIdentity: should not call sendPayloadKM when KM is disabled', (t) => {
  wbp = new WildberryPrincess({ useKissMetrics: false });
  t.is(kmq_spy.callCount, 0);
  wbp.clearIdentity(key, value);
  t.is(kmq_spy.callCount, 0);
});
