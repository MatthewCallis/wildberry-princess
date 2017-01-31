import test from 'ava';
import WildberryPrincess from '../src/wildberry-princess';

let wbp;

test.beforeEach((_t) => {
  window.ga = () => {};
  window._kmq = {};
  window._kmq.push = () => {};
  wbp = new WildberryPrincess();
});

test('#constructor: should contruct without issue', (t) => {
  t.true(wbp instanceof WildberryPrincess);
});

test('#constructor: should have known functions', (t) => {
  t.true(typeof wbp.trackUserActions === 'function');
  t.true(typeof wbp.clickHandler === 'function');
  t.true(typeof wbp.trackEvent === 'function');
  t.true(typeof wbp.trackPageView === 'function');
  t.true(typeof wbp.trackEcommerce === 'function');
  t.true(typeof wbp.set === 'function');
  t.true(typeof wbp.identify === 'function');
  t.true(typeof wbp.clearIdentity === 'function');

  t.true(typeof wbp.trackEventGA === 'function');
  t.true(typeof wbp.trackEventKM === 'function');
  t.true(typeof wbp.setGA === 'function');
  t.true(typeof wbp.setKM === 'function');
  t.true(typeof wbp.sendPayloadGA === 'function');
  t.true(typeof wbp.sendPayloadKM === 'function');
});

test('#constructor: should have default setting', (t) => {
  t.deepEqual(Object.keys(wbp.settings), ['useGoogleAnalytics', 'useKissMetrics', 'useFullStory', 'useSegment']);
  t.true(wbp.settings.useGoogleAnalytics);
  t.true(wbp.settings.useKissMetrics);
  t.true(wbp.settings.useFullStory);
  t.true(wbp.settings.useSegment);
});

test('#constructor: should set the settings based on passed in configuration', (t) => {
  wbp = new WildberryPrincess({ useGoogleAnalytics: false });
  t.false(wbp.settings.useGoogleAnalytics);
  t.true(wbp.settings.useKissMetrics);
  t.true(wbp.settings.useFullStory);
  t.true(wbp.settings.useSegment);

  wbp = new WildberryPrincess({ useKissMetrics: false });
  t.true(wbp.settings.useGoogleAnalytics);
  t.false(wbp.settings.useKissMetrics);
  t.true(wbp.settings.useFullStory);
  t.true(wbp.settings.useSegment);

  wbp = new WildberryPrincess({ useFullStory: false });
  t.true(wbp.settings.useGoogleAnalytics);
  t.true(wbp.settings.useKissMetrics);
  t.false(wbp.settings.useFullStory);
  t.true(wbp.settings.useSegment);

  wbp = new WildberryPrincess({ useSegment: false });
  t.true(wbp.settings.useGoogleAnalytics);
  t.true(wbp.settings.useKissMetrics);
  t.true(wbp.settings.useFullStory);
  t.false(wbp.settings.useSegment);

  wbp = new WildberryPrincess({
    useGoogleAnalytics: false,
    useKissMetrics: false,
    useFullStory: false,
    useSegment: false,
  });
  t.false(wbp.settings.useGoogleAnalytics);
  t.false(wbp.settings.useKissMetrics);
  t.false(wbp.settings.useFullStory);
  t.false(wbp.settings.useSegment);
});
