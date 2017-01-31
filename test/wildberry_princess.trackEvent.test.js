import test from 'ava';
import sinon from 'sinon';
import WildberryPrincess from '../src/wildberry-princess';

let wbp;
let ga_spy;
let kmq_spy;
let ga_send_spy;
let km_send_spy;

let track_event_ga_spy;
let track_event_km_spy;
let track_event_segment_spy;

test.beforeEach((_t) => {
  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  ga_spy = sinon.spy(window, 'ga');
  kmq_spy = sinon.spy(window._kmq, 'push');

  window.analytics = {};
  window.analytics.track = () => {};

  wbp = new WildberryPrincess();
  track_event_ga_spy = sinon.spy(wbp, 'trackEventGA');
  track_event_km_spy = sinon.spy(wbp, 'trackEventKM');
  track_event_segment_spy = sinon.spy(wbp, 'trackEventSegment');
  ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  km_send_spy = sinon.spy(wbp, 'sendPayloadKM');
});

test('#trackEvent: should call trackEventGA when GA is enabled', (t) => {
  t.is(track_event_ga_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.is(track_event_ga_spy.callCount, 1);
});

test('#trackEvent: should not call trackEventGA when GA is disabled', (t) => {
  wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  t.is(track_event_ga_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.is(track_event_ga_spy.callCount, 0);
});

test('#trackEvent: should call trackEventKM when KM is enabled', (t) => {
  t.is(track_event_km_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.is(track_event_km_spy.callCount, 1);
});

test('#trackEvent: should call trackEventKM with the correct params', (t) => {
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
  wbp = new WildberryPrincess({ useKissMetrics: false });
  t.is(track_event_km_spy.callCount, 0);
  wbp.trackEvent('a', 'b', 'c', 'd');
  t.is(track_event_km_spy.callCount, 0);
});

test('#trackEvent: should exclude label and value when not set', (t) => {
  t.is(track_event_km_spy.callCount, 0);
  wbp.trackEvent('a', 'b');
  t.true(track_event_km_spy.calledWith('a: undefined (b)', { action: 'b', category: 'a' }));
});

// trackEventGA
test('#trackEventGA: should track the event', (t) => {
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
  wbp.trackEventKM('!label', { '!key': '!value' });
  t.is(km_send_spy.callCount, 1);
  t.true(km_send_spy.calledWith('record', '!label', { '!key': '!value' }));
  t.is(kmq_spy.callCount, 1);
});

// trackEventSegment
test('#trackEventSegment: should track the event using sendPayloadKM', (t) => {
  wbp.trackEventSegment('!label', { '!key': '!value' });
  t.is(track_event_segment_spy.callCount, 1);
  t.true(track_event_segment_spy.calledWith('!label', { '!key': '!value' }));
});
