const test = require('ava');
const sinon = require('sinon');
const WildberryPrincess = require('./../src/wildberry-princess');

const key = 'my-key';
const value = 'my-value';

test.before((t) => {
  window.ga = () => {};

  window._kmq = {};
  window._kmq.push = () => {};

  window.analytics = {};
  window.analytics.identify = () => {};

  window.FS = {};
  window.FS.identify = () => {};

  window._cio = {};
  window._cio.identify = () => {};
});

// Google Analytics
test('#identify: should not call setGA when GA is enabled without a user', (t) => {
  const wbp = new WildberryPrincess();
  const setga_spy = sinon.spy(wbp, 'setGA');

  t.is(setga_spy.callCount, 0);
  wbp.identify();
  t.is(setga_spy.callCount, 0);

  setga_spy.restore();
});

test('#identify: should call setGA when GA is enabled with an user', (t) => {
  const wbp = new WildberryPrincess();
  const setga_spy = sinon.spy(wbp, 'setGA');

  t.is(setga_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(setga_spy.callCount, 1);
  t.true(setga_spy.calledWith('userId', '1234'));

  setga_spy.restore();
});

test('#identify: should not call setGA when GA is disabled', (t) => {
  const wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  const setga_spy = sinon.spy(wbp, 'setGA');

  t.is(setga_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(setga_spy.callCount, 0);

  setga_spy.restore();
});

// KissMetrics
test('#identify: should call setKM when KM is enabled', (t) => {
  const wbp = new WildberryPrincess();
  const kmq_spy = sinon.spy(window._kmq, 'push');

  t.is(kmq_spy.callCount, 0);
  wbp.identify();
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['identify', 'anonymous']));

  kmq_spy.restore();
});

test('#identify: should call setKM when KM is enabled with an user_id', (t) => {
  const wbp = new WildberryPrincess();
  const kmq_spy = sinon.spy(window._kmq, 'push');

  t.is(kmq_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['identify', '1234']));

  kmq_spy.restore();
});

test('#identify: should not call setKM when KM is disabled', (t) => {
  const wbp = new WildberryPrincess({ useKissMetrics: false });
  const kmq_spy = sinon.spy(window._kmq, 'push');

  t.is(kmq_spy.callCount, 0);
  wbp.identify();
  t.is(kmq_spy.callCount, 0);

  kmq_spy.restore();
});

// #clearIdentity
test('#clearIdentity: should call sendPayloadKM when KM is enabled', (t) => {
  const wbp = new WildberryPrincess();
  const kmq_spy = sinon.spy(window._kmq, 'push');

  t.is(kmq_spy.callCount, 0);
  wbp.clearIdentity();
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['clearIdentity']));

  kmq_spy.restore();
});

test('#clearIdentity: should not call sendPayloadKM when KM is disabled', (t) => {
  const wbp = new WildberryPrincess({ useKissMetrics: false });
  const kmq_spy = sinon.spy(window._kmq, 'push');

  t.is(kmq_spy.callCount, 0);
  wbp.clearIdentity(key, value);
  t.is(kmq_spy.callCount, 0);

  kmq_spy.restore();
});

// Segment.io
test('#identify: should not call Segment when useSegment is enabled without a user', (t) => {
  const wbp = new WildberryPrincess();
  const segment_spy = sinon.spy(window.analytics, 'identify');

  t.is(segment_spy.callCount, 0);
  wbp.identify();
  t.is(segment_spy.callCount, 0);

  segment_spy.restore();
});

test('#identify: should call Segment when useSegment is enabled with an user', (t) => {
  const wbp = new WildberryPrincess();
  const segment_spy = sinon.spy(window.analytics, 'identify');

  t.is(segment_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(segment_spy.callCount, 1);
  t.true(segment_spy.calledWith('1234'));

  segment_spy.restore();
});

test('#identify: should not call Segment when useSegment is disabled', (t) => {
  const wbp = new WildberryPrincess({ useSegment: false });
  const segment_spy = sinon.spy(window.analytics, 'identify');

  t.is(segment_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(segment_spy.callCount, 0);

  segment_spy.restore();
});

// FullStory
test('#identify: should not call FullStory when useFullStory is enabled without a user', (t) => {
  const wbp = new WildberryPrincess();
  const fs_spy = sinon.spy(window.FS, 'identify');

  t.is(fs_spy.callCount, 0);
  wbp.identify();
  t.is(fs_spy.callCount, 0);

  fs_spy.restore();
});

test('#identify: should call FullStory when useFullStory is enabled with an user', (t) => {
  const wbp = new WildberryPrincess();
  const fs_spy = sinon.spy(window.FS, 'identify');

  t.is(fs_spy.callCount, 0);
  wbp.identify({ id: '1234', name: 'NAME', email: 'EMAIL' });
  t.is(fs_spy.callCount, 1);
  t.true(fs_spy.calledWith('1234', { displayName: 'NAME', email: 'EMAIL' }));

  fs_spy.restore();
});

test('#identify: should not call FullStory when useFullStory is disabled', (t) => {
  const wbp = new WildberryPrincess({ useFullStory: false });
  const fs_spy = sinon.spy(window.FS, 'identify');

  t.is(fs_spy.callCount, 0);
  wbp.identify({ id: '1234', name: 'NAME', email: 'EMAIL' });
  t.is(fs_spy.callCount, 0);

  fs_spy.restore();
});

// Customer.io
test('#identify: should not call Customerio when useCustomerio is enabled without a user', (t) => {
  const wbp = new WildberryPrincess();
  const customerio_spy = sinon.spy(window._cio, 'identify');

  t.is(customerio_spy.callCount, 0);
  wbp.identify();
  t.is(customerio_spy.callCount, 0);

  customerio_spy.restore();
});

test('#identify: should call Customerio when useCustomerio is enabled with an user', (t) => {
  const wbp = new WildberryPrincess();
  const customerio_spy = sinon.spy(window._cio, 'identify');

  t.is(customerio_spy.callCount, 0);
  wbp.identify({ id: '1234', name: 'NAME', email: 'EMAIL' });
  t.is(customerio_spy.callCount, 1);
  t.true(customerio_spy.calledWith({ id: '1234', name: 'NAME', email: 'EMAIL' }));

  customerio_spy.restore();
});

test('#identify: should not call Customerio when useCustomerio is disabled', (t) => {
  const wbp = new WildberryPrincess({ useCustomerio: false });
  const customerio_spy = sinon.spy(window._cio, 'identify');

  t.is(customerio_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(customerio_spy.callCount, 0);

  customerio_spy.restore();
});
