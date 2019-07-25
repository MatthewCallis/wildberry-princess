const test = require('ava');
const sinon = require('sinon');
const WildberryPrincess = require('./../src/wildberry-princess');

test('#trackEvent: should call trackEventGA when GA is enabled', (t) => {
  window.ga = () => {};
  const wbp = new WildberryPrincess();
  const track_event_ga_spy = sinon.spy(wbp, 'trackEventGA');

  t.is(track_event_ga_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.is(track_event_ga_spy.callCount, 1);
});

test('#trackEvent: should not call trackEventGA when GA is disabled', (t) => {
  window.ga = () => {};
  const wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  const track_event_ga_spy = sinon.spy(wbp, 'trackEventGA');

  t.is(track_event_ga_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.is(track_event_ga_spy.callCount, 0);
});

test('#trackEvent: should call trackEventKM when KM is enabled', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const wbp = new WildberryPrincess();
  const track_event_km_spy = sinon.spy(wbp, 'trackEventKM');

  t.is(track_event_km_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.is(track_event_km_spy.callCount, 1);
});

test('#trackEvent: should call trackEventKM with the correct params', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const wbp = new WildberryPrincess();
  const track_event_km_spy = sinon.spy(wbp, 'trackEventKM');

  t.is(track_event_km_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.true(track_event_km_spy.calledWith('a: c (b)', {
    action: 'b',
    category: 'a',
    label: 'c',
    value: 'd',
  }));
});

test('#trackEvent: should not call trackEventKM when KM is disabled', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const wbp = new WildberryPrincess({ useKissMetrics: false });
  const track_event_km_spy = sinon.spy(wbp, 'trackEventKM');

  t.is(track_event_km_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.is(track_event_km_spy.callCount, 0);
});

test('#trackEvent: should exclude label and value when not set', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const wbp = new WildberryPrincess();
  const track_event_km_spy = sinon.spy(wbp, 'trackEventKM');

  t.is(track_event_km_spy.callCount, 0);
  wbp.trackEvent('a', 'b');
  t.true(track_event_km_spy.calledWith('a: undefined (b)', { action: 'b', category: 'a' }));
});

test('#trackEvent: should call trackEventCustomerio when enabled', (t) => {
  window._cio = {};
  window._cio.track = () => {};
  const wbp = new WildberryPrincess();
  const track_event_customerio_spy = sinon.spy(wbp, 'trackEventCustomerio');

  wbp.trackEvent('!category', '!event');
  t.is(track_event_customerio_spy.callCount, 1);
  t.true(track_event_customerio_spy.calledWith('!event', { category: '!category' }));
});

test('#trackEvent: should not call trackEventCustomerio when disabled', (t) => {
  window._cio = {};
  window._cio.track = () => {};
  const wbp = new WildberryPrincess({ useCustomerio: false });
  const track_event_customerio_spy = sinon.spy(wbp, 'trackEventCustomerio');

  wbp.trackEvent('!category', '!event');
  t.is(track_event_customerio_spy.callCount, 0);
});

// trackEventGA
test('#trackEventGA: should track the event', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');

  wbp.trackEventGA('a', 'b', 'c', 'd');

  const payload = {
    eventCategory: 'a',
    eventAction: 'b',
    eventLabel: 'c',
    eventValue: 'd',
    hitType: 'event',
  };

  t.is(ga_send_spy.callCount, 1);
  t.true(ga_send_spy.calledWith(payload));
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('send', payload));
});

test('#trackEventGA: should track the event without a label', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');

  wbp.trackEventGA('a', 'b', null, 'd');

  const payload = {
    eventCategory: 'a',
    eventAction: 'b',
    eventValue: 'd',
    hitType: 'event',
  };

  t.is(ga_send_spy.callCount, 1);
  t.true(ga_send_spy.calledWith(payload));
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('send', payload));
});

test('#trackEventGA: should track the event without a value', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');

  wbp.trackEventGA('a', 'b', 'c');

  const payload = {
    eventCategory: 'a',
    eventAction: 'b',
    eventLabel: 'c',
    hitType: 'event',
  };

  t.is(ga_send_spy.callCount, 1);
  t.true(ga_send_spy.calledWith(payload));
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('send', payload));
});

// trackEventKM
test('#trackEventKM: should track the event using sendPayloadKM', (t) => {
  window._kmq = {};
  window._kmq.push = () => {};
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp = new WildberryPrincess();
  const km_send_spy = sinon.spy(wbp, 'sendPayloadKM');

  wbp.trackEventKM('!label', { '!key': '!value' });
  t.is(km_send_spy.callCount, 1);
  t.true(km_send_spy.calledWith('record', '!label', { '!key': '!value' }));
  t.is(kmq_spy.callCount, 1);
});

// trackEventSegment
test('#trackEventSegment: should track the event using trackEventSegment', (t) => {
  window.analytics = {};
  window.analytics.track = () => {};
  const wbp = new WildberryPrincess();
  const track_event_segment_spy = sinon.spy(wbp, 'trackEventSegment');

  wbp.trackEventSegment('!label', { '!key': '!value' });
  t.is(track_event_segment_spy.callCount, 1);
  t.true(track_event_segment_spy.calledWith('!label', { '!key': '!value' }));

  wbp.trackEventSegment('!label');
  t.is(track_event_segment_spy.callCount, 2);
});

test('#trackEventCustomerio: should call track', (t) => {
  window._cio = {};
  window._cio.track = () => {};
  const cio_spy = sinon.spy(window._cio, 'track');
  const wbp = new WildberryPrincess();

  wbp.trackEventCustomerio('!label', { '!key': '!value' });
  t.is(cio_spy.callCount, 1);
  t.true(cio_spy.calledWith('!label', { '!key': '!value' }));

  wbp.trackEventCustomerio('!label');
  t.is(cio_spy.callCount, 2);
});
