import test from 'ava';
import sinon from 'sinon';
import WildberryPrincess from '../src/wildberry-princess';

let wbp;
let ga_spy;
let ga_send_spy;

test.beforeEach((_t) => {
  window.ga = () => {};
  ga_spy = sinon.spy(window, 'ga');

  wbp = new WildberryPrincess();
  ga_send_spy = sinon.spy(wbp, 'sendPayloadGA');
});

test('#trackPageView: should track the page view', (t) => {
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
});

test('#trackPageView: should not track the page view if GA is not enabled', (t) => {
  wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  t.is(ga_send_spy.callCount, 0);
  wbp.trackPageView('a', 'b');
  t.is(ga_send_spy.callCount, 0);
});

test('#trackPageView: should track the page view without a page provided', (t) => {
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
});

test('#trackPageView: should track the page view without a title', (t) => {
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
});
