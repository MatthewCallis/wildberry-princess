import test from 'ava';
import sinon from 'sinon';
import WildberryPrincess from '../src/wildberry-princess';

let wbp;
let ga_spy;
let kmq_spy;
let key;
let value;
let setga_spy;
let setkm_spy;

test.beforeEach((_t) => {
  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  ga_spy = sinon.spy(window, 'ga');
  kmq_spy = sinon.spy(window._kmq, 'push');

  wbp = new WildberryPrincess();

  setga_spy = sinon.spy(wbp, 'setGA');
  setkm_spy = sinon.spy(wbp, 'setKM');

  key = 'my-key';
  value = 'my-value';
});

test('#set: should call setGA when GA is enabled', (t) => {
  t.is(setga_spy.callCount, 0);
  wbp.set(key, value);
  t.is(setga_spy.callCount, 1);
});

test('#set: should not call setGA when GA is disabled', (t) => {
  wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  t.is(setga_spy.callCount, 0);
  wbp.set(key, value);
  t.is(setga_spy.callCount, 0);
});

test('#set: should call setKM when KM is enabled', (t) => {
  t.is(setkm_spy.callCount, 0);
  wbp.set(key, value);
  t.is(setkm_spy.callCount, 1);
});

test('#set: should not call setKM when KM is disabled', (t) => {
  wbp = new WildberryPrincess({ useKissMetrics: false });
  t.is(setkm_spy.callCount, 0);
  wbp.set(key, value);
  t.is(setkm_spy.callCount, 0);
});

// #setGA
test('#setGA: should set the key to the value when there is GA', (t) => {
  t.is(ga_spy.callCount, 0);
  wbp.setGA(key, value);
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('set', key, value));
});

test('#setGA: should not set the key to the value when there is no GA', (t) => {
  window.ga = null;
  t.is(ga_spy.callCount, 0);
  wbp.setGA(key, value);
  t.is(ga_spy.callCount, 0);
});

// #setKM
test('#setKM: should set the key to the value when there is KM', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.setKM(key, value);
  t.is(kmq_spy.callCount, 1);
  const output = {};
  output[key] = value;
  t.true(kmq_spy.calledWith(['set', output]));
});

test('#setKM: should not set the key to the value when there is no MK', (t) => {
  window._kmq = null;
  t.is(kmq_spy.callCount, 0);
  wbp.setKM(key, value);
  t.is(kmq_spy.callCount, 0);
});
