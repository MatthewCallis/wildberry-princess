import test from 'ava';
import sinon from 'sinon';
import WildberryPrincess from '../src/wildberry-princess';

let wbp;
let key;
let value;
let kmq_spy;
let setga_spy;
let segment_spy;
let fs_spy;

test.beforeEach((_t) => {
  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  kmq_spy = sinon.spy(window._kmq, 'push');

  window.analytics = {};
  window.analytics.identify = () => {};
  segment_spy = sinon.spy(window.analytics, 'identify');

  window.FS = {};
  window.FS.identify = () => {};
  fs_spy = sinon.spy(window.FS, 'identify');

  wbp = new WildberryPrincess();
  setga_spy = sinon.spy(wbp, 'setGA');
  key = 'my-key';
  value = 'my-value';
});

test.afterEach((_t) => {
  window._kmq.push.restore();
});

// Google Analytics
test('#identify: should not call setGA when GA is enabled without a user', (t) => {
  t.is(setga_spy.callCount, 0);
  wbp.identify();
  t.is(setga_spy.callCount, 0);
});

test('#identify: should call setGA when GA is enabled with an user', (t) => {
  t.is(setga_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(setga_spy.callCount, 1);
  t.true(setga_spy.calledWith('userId', '1234'));
});

test('#identify: should not call setGA when GA is disabled', (t) => {
  wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  t.is(setga_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(setga_spy.callCount, 0);
});

// KissMetrics
test('#identify: should call setKM when KM is enabled', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.identify();
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['identify', 'anonymous']));
});

test('#identify: should call setKM when KM is enabled with an user_id', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['identify', '1234']));
});

test('#identify: should not call setKM when KM is disabled', (t) => {
  wbp = new WildberryPrincess({ useKissMetrics: false });
  t.is(kmq_spy.callCount, 0);
  wbp.identify();
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

// Segment.io
test('#identify: should not call Segment when useSegment is enabled without a user', (t) => {
  t.is(segment_spy.callCount, 0);
  wbp.identify();
  t.is(segment_spy.callCount, 0);
});

test('#identify: should call Segment when useSegment is enabled with an user', (t) => {
  t.is(segment_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(segment_spy.callCount, 1);
  t.true(segment_spy.calledWith('1234'));
});

test('#identify: should not call Segment when useSegment is disabled', (t) => {
  wbp = new WildberryPrincess({ useSegment: false });
  t.is(segment_spy.callCount, 0);
  wbp.identify({ id: '1234' });
  t.is(segment_spy.callCount, 0);
});

// FullStory
test('#identify: should not call FullStory when useFullStory is enabled without a user', (t) => {
  t.is(fs_spy.callCount, 0);
  wbp.identify();
  t.is(fs_spy.callCount, 0);
});

test('#identify: should call FullStory when useFullStory is enabled with an user', (t) => {
  t.is(fs_spy.callCount, 0);
  wbp.identify({ id: '1234', name: 'NAME', email: 'EMAIL' });
  t.is(fs_spy.callCount, 1);
  t.true(fs_spy.calledWith('1234', { displayName: 'NAME', email: 'EMAIL' }));
});

test('#identify: should not call FullStory when useFullStory is disabled', (t) => {
  wbp = new WildberryPrincess({ useFullStory: false });
  t.is(fs_spy.callCount, 0);
  wbp.identify({ id: '1234', name: 'NAME', email: 'EMAIL' });
  t.is(fs_spy.callCount, 0);
});
