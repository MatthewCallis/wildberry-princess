# Wildberry Princess

[![Build Status](https://travis-ci.org/MatthewCallis/wildberry-princess.svg)](https://travis-ci.org/MatthewCallis/wildberry-princess)
[![Dependency Status](https://david-dm.org/MatthewCallis/wildberry-princess.svg)](https://david-dm.org/MatthewCallis/wildberry-princess)
[![devDependency Status](https://david-dm.org/MatthewCallis/wildberry-princess/dev-status.svg?style=flat)](https://david-dm.org/MatthewCallis/wildberry-princess#info=devDependencies)
[![Test Coverage](https://codeclimate.com/github/MatthewCallis/wildberry-princess/badges/coverage.svg)](https://codeclimate.com/github/MatthewCallis/wildberry-princess)
[![Coverage Status](https://coveralls.io/repos/MatthewCallis/wildberry-princess/badge.svg?branch=master)](https://coveralls.io/r/MatthewCallis/wildberry-princess?branch=master)

![Wildberry Princess](https://raw.githubusercontent.com/MatthewCallis/wildberry-princess/master/wildberry-princess.png)

_-- "I found this note stabbed to my door! ... man."_

Wildberry Princess is a JavaScript library for abstracting out Google Analytics (analytics.js), KissMetrics, Segment.io, FullStory and perhaps other analytics platforms in the future.

## Usage

```javascript
// Google Analytics initialized somewhere...
// Kissmetrics initialized somewhere...
// Segment.io initialized somewhere...
// FullStory initialized somewhere...

// Setup
const analytics = new WildberryPrincess({
  useGoogleAnalytics: true,
  useKissMetrics: false,
});

// Set dimensions and users.
if (current_user_id != null) {
  analytics.identify(current_user_id);
}

if (app_id != null) {
  analytics.set('dimension1', app_id);
}

// Track user actions, specifically clicks, where the label is the text content (button, div, tab, etc.) or form input name (input, select, textarea).
// analytics.trackUserActions(selector, category, action, label, value)
analytics.trackUserActions('button', 'Button');
analytics.trackUserActions('input, select, textarea', 'Form Input');
analytics.trackUserActions('tab', 'Tab');

// Send events anywhere, like Backbone model actions.
// analytics.trackEvent(category, action, label, value)
analytics.trackEvent('Model', 'Destroy', this.constructorName);

// Track page views. Currently
// NOTE: KissMetrics is not included here to avoid event bloat 🤑
apptentive.analytics.trackPageView('/fake-page', 'A Cool Fake Title');

// Send eCommerce data.
const transaction_id = `${this.model.id}_${Date.now()}`;
const transaction = {
  id: transaction_id,
  affiliation: 'Candy Kingdom',
  revenue: price,
  shipping: '0',
  tax: '0',
};
const item = {
  id: transaction_id,
  name,
  category,
  price,
  quantity: 1,
};

analytics.trackEcommerce('clear');
analytics.trackEcommerce('addTransaction', transaction);
analytics.trackEcommerce('addItem', item);
analytics.trackEcommerce('send');
```

For more advanced use, please refer to the source.

### Testing

```shell
npm run lint
npm run make
npm run test
npm run report
npm run make-dist-min
```

## Useful Reading

### Google Analytics
- [Analytics.js Field Reference](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference)
- [Cookies and User Identification](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id)
- [Custom Dimensions and Metrics](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets)
- [Event Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)

### Segment.io
- [Track (Google Analytics)](https://segment.com/docs/integrations/google-analytics/#track)
- [Track (Segment.io)](https://segment.com/docs/sources/website/analytics.js/#track)
- [Identify](https://segment.com/docs/spec/identify/)

# Contributors

- [Owen Kim](https://github.com/owenkim) - Segment.io Support

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

![It's gunna be so flippin' awesome!](https://raw.githubusercontent.com/MatthewCallis/HotDogPrincess/master/awesome.gif)
