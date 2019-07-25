const test = require('ava');
const sinon = require('sinon');
const WildberryPrincess = require('./../src/wildberry-princess');

test('#trackPageView: should track the page view', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');

  wbp.trackPageView('a', 'b');

  const payload = {
    page: 'a',
    title: 'b',
    hitType: 'pageview',
  };

  t.is(ga_send_spy.callCount, 1);
  t.true(ga_send_spy.calledWith(payload));
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('send', payload));

  window.ga.restore();
  wbp.sendPayloadGA.restore();
});

test('#trackPageView: should not track the page view if GA is not enabled', (t) => {
  window.ga = () => {};
  const wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');

  t.is(ga_send_spy.callCount, 0);
  wbp.trackPageView('a', 'b');
  t.is(ga_send_spy.callCount, 0);

  wbp.sendPayloadGA.restore();
});

test('#trackPageView: should track the page view without a page provided', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');

  wbp.trackPageView(null, 'b');
  const payload = {
    page: window.location.pathname,
    title: 'b',
    hitType: 'pageview',
  };

  t.is(ga_send_spy.callCount, 1);
  t.true(ga_send_spy.calledWith(payload));
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('send', payload));

  window.ga.restore();
  wbp.sendPayloadGA.restore();
});

test('#trackPageView: should track the page view without a title', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();
  const ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');

  wbp.trackPageView('a', null);
  const payload = {
    page: 'a',
    title: document.title,
    hitType: 'pageview',
  };

  t.is(ga_send_spy.callCount, 1);
  t.true(ga_send_spy.calledWith(payload));
  t.is(ga_spy.callCount, 1);
  t.true(ga_spy.calledWith('send', payload));

  window.ga.restore();
  wbp.sendPayloadGA.restore();
});
