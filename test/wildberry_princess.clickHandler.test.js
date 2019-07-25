const test = require('ava');
const sinon = require('sinon');
const WildberryPrincess = require('./../src/wildberry-princess');

let button;

test.before(() => {
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

test.beforeEach(() => {
  button = document.createElement('button');
  button.textConent = 'First Button';
  button.setAttribute('data-event-label', 'First Button');
  document.body.append(button);
});

test.afterEach.always(() => {
  if (button && button.parentNode) {
    button.remove();
  }
});

test('#clickHandler: should track clicks on elements', (t) => {
  const wbp = new WildberryPrincess();

  const ga_spy = sinon.spy(window, 'ga');
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp_click_spy = sinon.spy(wbp, 'clickHandler');
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  const km_send_spy = sinon.spy(wbp, 'sendPayloadKM');

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

  window.ga.restore();
  window._kmq.push.restore();
  wbp.clickHandler.restore();
  wbp.sendPayloadGA.restore();
  wbp.sendPayloadKM.restore();
});

test('#clickHandler: should track clicks on elements with optional value', (t) => {
  const wbp = new WildberryPrincess();

  const ga_spy = sinon.spy(window, 'ga');
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp_click_spy = sinon.spy(wbp, 'clickHandler');
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  const km_send_spy = sinon.spy(wbp, 'sendPayloadKM');

  wbp.trackUserActions('button', 'Buttons', 'Click', null, 1);

  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 1);
  t.is(km_send_spy.callCount, 1);

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

  window.ga.restore();
  window._kmq.push.restore();
  wbp.clickHandler.restore();
  wbp.sendPayloadGA.restore();
  wbp.sendPayloadKM.restore();
});

test('#clickHandler: should not set a label unless it is provided', (t) => {
  const wbp = new WildberryPrincess();

  const ga_spy = sinon.spy(window, 'ga');
  const kmq_spy = sinon.spy(window._kmq, 'push');
  const wbp_click_spy = sinon.spy(wbp, 'clickHandler');
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  const km_send_spy = sinon.spy(wbp, 'sendPayloadKM');

  button.removeAttribute('data-event-label');
  wbp.trackUserActions('button', 'Buttons');

  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 1);
  t.is(km_send_spy.callCount, 1);

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

  window.ga.restore();
  window._kmq.push.restore();
  wbp.clickHandler.restore();
  wbp.sendPayloadGA.restore();
  wbp.sendPayloadKM.restore();
});

test('#clickHandler: should return when there is no event', (t) => {
  const wbp = new WildberryPrincess();

  const wbp_click_spy = sinon.spy(wbp, 'clickHandler');
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  const km_send_spy = sinon.spy(wbp, 'sendPayloadKM');

  wbp.clickHandler();

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 0);
  t.is(km_send_spy.callCount, 0);

  wbp.clickHandler.restore();
  wbp.sendPayloadGA.restore();
  wbp.sendPayloadKM.restore();
});

test('#clickHandler: should return when there is no eventParams', (t) => {
  const wbp = new WildberryPrincess();

  const wbp_click_spy = sinon.spy(wbp, 'clickHandler');
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  const km_send_spy = sinon.spy(wbp, 'sendPayloadKM');

  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  wbp.clickHandler(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 0);
  t.is(km_send_spy.callCount, 0);

  wbp.clickHandler.restore();
  wbp.sendPayloadGA.restore();
  wbp.sendPayloadKM.restore();
});

test('#clickHandler: should not call GA when useGoogleAnalytics is false', (t) => {
  const wbp = new WildberryPrincess();

  const wbp_click_spy = sinon.spy(wbp, 'clickHandler');
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  const km_send_spy = sinon.spy(wbp, 'sendPayloadKM');

  wbp.settings.useGoogleAnalytics = false;
  wbp.trackUserActions('button', 'Buttons');

  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 0);
  t.is(km_send_spy.callCount, 1);

  wbp.clickHandler.restore();
  wbp.sendPayloadGA.restore();
  wbp.sendPayloadKM.restore();
});

test('#clickHandler: should not call KM when useKissMetrics is false', (t) => {
  const wbp = new WildberryPrincess();

  const wbp_click_spy = sinon.spy(wbp, 'clickHandler');
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
  const km_send_spy = sinon.spy(wbp, 'sendPayloadKM');

  wbp.settings.useKissMetrics = false;
  wbp.trackUserActions('button', 'Buttons');

  const click_event = document.createEvent('HTMLEvents');
  click_event.initEvent('click', true, false);
  button.dispatchEvent(click_event);

  t.is(wbp_click_spy.callCount, 1);
  t.is(ga_send_spy.callCount, 1);
  t.is(km_send_spy.callCount, 0);

  wbp.clickHandler.restore();
  wbp.sendPayloadGA.restore();
  wbp.sendPayloadKM.restore();
});
