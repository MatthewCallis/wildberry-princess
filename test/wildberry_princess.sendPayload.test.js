const test = require('ava');
const sinon = require('sinon');
const WildberryPrincess = require('./../src/wildberry-princess');

// #sendPayloadGA
test('#sendPayloadGA: should send the payload when there is GA', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();

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

  window.ga.restore();
});

test('#sendPayloadGA: should not send the payload when there is no GA', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();

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
  window._kmq = {};
  window._kmq.push = () => {};
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp = new WildberryPrincess();

  t.is(kmq_spy.callCount, 0);
  wbp.sendPayloadKM('record', 'event', { 'event-data': '1' });
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['record', 'event', { 'event-data': '1' }]));

  window._kmq.push.restore();
});

test('#sendPayloadKM: should send the partial payload when there is KM', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp = new WildberryPrincess();

  t.is(kmq_spy.callCount, 0);
  wbp.sendPayloadKM('record', 'event');
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['record', 'event']));

  window._kmq.push.restore();
});

test('#sendPayloadKM: should send the action-only payload when there is KM', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp = new WildberryPrincess();

  t.is(kmq_spy.callCount, 0);
  wbp.sendPayloadKM('record');
  t.is(kmq_spy.callCount, 1);
  t.true(kmq_spy.calledWith(['record']));

  window._kmq.push.restore();
});

test('#sendPayloadKM: should not send the payload when there is no KM', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp = new WildberryPrincess();

  window._kmq = null;
  t.is(kmq_spy.callCount, 0);
  wbp.sendPayloadKM('record');
  t.is(kmq_spy.callCount, 0);
});
