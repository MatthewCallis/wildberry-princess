import test from 'ava';
import sinon from 'sinon';
import WildberryPrincess from '../src/wildberry_princess';

let wbp;
let ga_spy;
let kmq_spy;

test.beforeEach((_t) => {
  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  ga_spy = sinon.spy(window, 'ga');
  kmq_spy = sinon.spy(window._kmq, 'push');

  wbp = new WildberryPrincess();
});

// #sendPayloadGA
test('#sendPayloadGA: should send the payload when there is GA', (t) => {
  const payload = {
    hitType: 'event',
    eventCategory: 'my-category',
    eventAction: 'my-action',
    eventLabel: 'my-label',
    eventValue: 'my-value',
  };

  t.is(ga_spy.callCount, 0);
  wbp.sendPayloadGA(payload);
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('send', payload));
});

test('#sendPayloadGA: should not send the payload when there is no GA', (t) => {
  const payload = {
    hitType: 'event',
    eventCategory: 'my-category',
    eventAction: 'my-action',
    eventLabel: 'my-label',
    eventValue: 'my-value',
  };

  window.ga = null;
  t.is(ga_spy.callCount, 0);
  wbp.sendPayloadGA(payload);
  t.is(ga_spy.callCount, 0);
});

// #sendPayloadKM
test('#sendPayloadKM: should send the full payload when there is KM', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.sendPayloadKM('record', 'event', { 'event-data': '1' });
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['record', 'event', { 'event-data': '1' }]));
});

test('#sendPayloadKM: should send the partial payload when there is KM', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.sendPayloadKM('record', 'event');
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['record', 'event']));
});

test('#sendPayloadKM: should send the action-only payload when there is KM', (t) => {
  t.is(kmq_spy.callCount, 0);
  wbp.sendPayloadKM('record');
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['record']));
});

test('#sendPayloadKM: should not send the payload when there is no KM', (t) => {
  window._kmq = null;
  t.is(kmq_spy.callCount, 0);
  wbp.sendPayloadKM('record');
  t.is(kmq_spy.callCount, 0);
});
