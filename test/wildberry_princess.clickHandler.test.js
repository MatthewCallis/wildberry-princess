import test from 'ava';
import sinon from 'sinon';
import WildberryPrincess from '../src/wildberry_princess';

let wbp;
let button;
let wbp_click_spy;
let ga_send_spy;
let km_send_spy;
let ga_spy;
let kmq_spy;

test.beforeEach((_t) => {
  button = document.createElement('button');
  button.textConent = 'First Button';
  button.setAttribute('data-event-label', 'First Button');
  document.body.appendChild(button);

  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  ga_spy = sinon.spy(window, 'ga');
  kmq_spy = sinon.spy(window._kmq, 'push');

  wbp = new WildberryPrincess();
  wbp_click_spy = sinon.spy(wbp, 'clickHandler');
  ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  km_send_spy = sinon.spy(wbp, 'sendPayloadKM');
});

test.afterEach((_t) => {
  button.parentNode.removeChild(button);

  window.ga.restore();
  window._kmq.push.restore();
  wbp.clickHandler.restore();
  wbp.sendPayloadGA.restore();
  wbp.sendPayloadKM.restore();
});

test('#clickHandler: should track clicks on elements', (t) => {
  wbp.trackUserActions('button', 'Buttons');
  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 1);
  t.is(km_send_spy.callCount, 1);
  t.is(ga_spy.callCount, 1);
  t.is(kmq_spy.callCount, 1);

  t.true(ga_spy.calledWith('send', {
    eventCategory: 'Buttons',
    eventAction: 'Click',
    eventLabel: 'First Button',
    hitType: 'event',
  }));

  t.true(kmq_spy.calledWith([
    'record', 'Buttons: First Button (Click)', {
      action: 'Click',
      category: 'Buttons',
      label: 'First Button',
    },
  ]));
});

test('#clickHandler: should not set a label unless it is provided', (t) => {
  button.removeAttribute('data-event-label');
  wbp.trackUserActions('button', 'Buttons');
  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 1);
  t.is(km_send_spy.callCount, 1);
  t.is(ga_spy.callCount, 1);
  t.is(kmq_spy.callCount, 1);

  t.true(ga_spy.calledWith('send', {
    eventCategory: 'Buttons',
    eventAction: 'Click',
    hitType: 'event',
  }));

  t.true(kmq_spy.calledWith([
    'record', 'Buttons: null (Click)', {
      action: 'Click',
      category: 'Buttons',
    },
  ]));
});

test('#clickHandler: should track clicks on elements with optional value', (t) => {
  wbp.trackUserActions('button', 'Buttons', 'Click', null, 1);
  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 1);
  t.is(km_send_spy.callCount, 1);
  t.is(ga_spy.callCount, 1);
  t.is(kmq_spy.callCount, 1);

  t.true(ga_spy.calledWith('send', {
    eventCategory: 'Buttons',
    eventAction: 'Click',
    eventLabel: 'First Button',
    eventValue: 1,
    hitType: 'event',
  }));

  t.true(kmq_spy.calledWith([
    'record', 'Buttons: First Button (Click)', {
      action: 'Click',
      category: 'Buttons',
      label: 'First Button',
      value: 1,
    },
  ]));
});

test('#clickHandler: should return when there is no event', (t) => {
  wbp.clickHandler();

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 0);
  t.is(km_send_spy.callCount, 0);
  t.is(ga_spy.callCount, 0);
  t.is(kmq_spy.callCount, 0);
});

test('#clickHandler: should return when there is no eventParams', (t) => {
  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  wbp.clickHandler(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 0);
  t.is(km_send_spy.callCount, 0);
  t.is(ga_spy.callCount, 0);
  t.is(kmq_spy.callCount, 0);
});

test('#clickHandler: should not call GA when useGoogleAnalytics is false', (t) => {
  wbp.settings.useGoogleAnalytics = false;
  wbp.trackUserActions('button', 'Buttons');
  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 0);
  t.is(km_send_spy.callCount, 1);
  t.is(ga_spy.callCount, 0);
  t.is(kmq_spy.callCount, 1);
});

test('#clickHandler: should not call KM when useGoogleAnalytics is false', (t) => {
  wbp.settings.useKissMetrics = false;
  wbp.trackUserActions('button', 'Buttons');
  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 1);
  t.is(km_send_spy.callCount, 0);
  t.is(ga_spy.callCount, 1);
  t.is(kmq_spy.callCount, 0);
});
