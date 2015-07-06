# Wildberry Princess

[![Build Status](https://travis-ci.org/MatthewCallis/wildberry-princess.svg)](https://travis-ci.org/MatthewCallis/wildberry-princess)
[![Dependency Status](https://david-dm.org/MatthewCallis/wildberry-princess.svg)](https://david-dm.org/MatthewCallis/wildberry-princess)
[![devDependency Status](https://david-dm.org/MatthewCallis/wildberry-princess/dev-status.svg?style=flat)](https://david-dm.org/MatthewCallis/wildberry-princess#info=devDependencies)
[![Test Coverage](https://codeclimate.com/github/MatthewCallis/wildberry-princess/badges/coverage.svg)](https://codeclimate.com/github/MatthewCallis/wildberry-princess)
[![Coverage Status](https://coveralls.io/repos/MatthewCallis/wildberry-princess/badge.svg?branch=master)](https://coveralls.io/r/MatthewCallis/wildberry-princess?branch=master)

![Wildberry Princess](https://raw.githubusercontent.com/MatthewCallis/wildberry-princess/master/wildberry-princess.png)

_-- "I found this note stabbed to my door! ... man."_

Wildberry Princess is a JavaScript library for abstracting out Google Analytics (analytics.js), KissMetrics, and perhaps other analytics platforms in the future.

## Usage

```coffeescript
# Google Analytics initialized somewhere...
# Kissmetrics initialized somewhere...

# Setup
analytics = new WildberryPrincess(
  useGoogleAnalytics: true
  useKissMetrics: true
)

# Set dimensions and users.
analytics.identify(current_user_id) if current_user_id?
analytics.set('dimension1', app_id)  if app_id?

# Or more specifically:
analytics.setGA('dimension1', app_id)  if app_id?
analytics.setKM('app_id', app_id)  if app_id?

# Track user actions, specifically clicks, where the label is the text content (button, div, tab, etc.) or form input name (input, select, textarea).
# analytics.trackUserActions(selector, category, action, label, value)
analytics.trackUserActions('button', 'Button')
analytics.trackUserActions('input, select, textarea', 'Form Input')
analytics.trackUserActions('tab', 'Tab')

# Send events anywhere, like Backbone model actions.
# analytics.trackEvent(category, action, label, value)
# analytics.trackEventGA(category, action, label, value)
# analytics.trackEventKM(label, payload)
analytics.trackEvent('Model', 'Destroy', @constructorName)

# Track page views. Currently, KissMetrics is not included here to avoid event bloat.
Apptentive.analytics.trackPageView('/fake-page', 'A Cool Fake Title')

# Send eCommerce data.
transaction_id = "#{@model.id}_#{Date.now()}"
transaction =
  id:          transaction_id
  affiliation: "Candy Kingdom"
  revenue:     price
  shipping:    '0'
  tax:         '0'

item =
  id:       transaction_id
  name:     name
  category: category
  price:    price
  quantity: 1

analytics.trackEcommerce('clear')
analytics.trackEcommerce('addTransaction', transaction)
analytics.trackEcommerce('addItem', item)
analytics.trackEcommerce('send')
```

### Testing

```shell
npm run lint
npm run make
npm run instrument
npm run test-phantomjs
npm run coverage-report
npm run make-dist-min
# or
npm run lint && npm run make && npm run instrument && npm run test-phantomjs && npm run coverage-report && npm run make-dist-min
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

![It's gunna be so flippin' awesome!](https://raw.githubusercontent.com/MatthewCallis/HotDogPrincess/master/awesome.gif)
