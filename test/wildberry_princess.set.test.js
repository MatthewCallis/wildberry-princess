const test = require('ava');
const sinon = require('sinon');
const WildberryPrincess = require('./../src/wildberry-princess');

const key = 'my-key';
const value = 'my-value';

test('#set: should call setGA when GA is enabled', (t) => {
  window.ga = () => {};
  const wbp = new WildberryPrincess();
  const setga_spy = sinon.spy(wbp, 'setGA');

  t.is(setga_spy.callCount, 0);
  wbp.set(key, value);
  t.is(setga_spy.callCount, 1);
});

test('#set: should not call setGA when GA is disabled', (t) => {
  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  const wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  const setga_spy = sinon.spy(wbp, 'setGA');

  t.is(setga_spy.callCount, 0);
  wbp.set(key, value);
  t.is(setga_spy.callCount, 0);
});

test('#set: should call setKM when KM is enabled', (t) => {
  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  const wbp = new WildberryPrincess();
  const setkm_spy = sinon.spy(wbp, 'setKM');

  t.is(setkm_spy.callCount, 0);
  wbp.set(key, value);
  t.is(setkm_spy.callCount, 1);
});

test('#set: should not call setKM when KM is disabled', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const wbp = new WildberryPrincess({ useKissMetrics: false });
  const setkm_spy = sinon.spy(wbp, 'setKM');

  t.is(setkm_spy.callCount, 0);
  wbp.set(key, value);
  t.is(setkm_spy.callCount, 0);
});

// #setGA
test('#setGA: should set the key to the value when there is GA', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();

  t.is(ga_spy.callCount, 0);
  wbp.setGA(key, value);
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('set', key, value));
});

test('#setGA: should not set the key to the value when there is no GA', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();

  window.ga = null;
  t.is(ga_spy.callCount, 0);
  wbp.setGA(key, value);
  t.is(ga_spy.callCount, 0);
});

// #setKM
test('#setKM: should set the key to the value when there is KM', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp = new WildberryPrincess();

  t.is(kmq_spy.callCount, 0);
  wbp.setKM(key, value);
  t.is(kmq_spy.callCount, 1);
  const output = {};
  output[key] = value;
  t.true(kmq_spy.calledWith(['set', output]));
});

test('#setKM: should not set the key to the value when there is no MK', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp = new WildberryPrincess();

  window._kmq = null;
  t.is(kmq_spy.callCount, 0);
  wbp.setKM(key, value);
  t.is(kmq_spy.callCount, 0);
});
