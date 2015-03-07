# Wildberry Princess

[![Build Status](https://travis-ci.org/MatthewCallis/wildberry-princess.svg)](https://travis-ci.org/MatthewCallis/wildberry-princess)
[![Dependency Status](https://david-dm.org/MatthewCallis/wildberry-princess.svg)](https://david-dm.org/MatthewCallis/wildberry-princess)
[![devDependency Status](https://david-dm.org/MatthewCallis/wildberry-princess/dev-status.svg?style=flat)](https://david-dm.org/MatthewCallis/wildberry-princess#info=devDependencies)
[![Test Coverage](https://codeclimate.com/github/MatthewCallis/wildberry-princess/badges/coverage.svg)](https://codeclimate.com/github/MatthewCallis/wildberry-princess)
[![Code Climate](https://codeclimate.com/github/MatthewCallis/wildberry-princess/badges/gpa.svg)](https://codeclimate.com/github/MatthewCallis/wildberry-princess)

![Wildberry Princess](https://raw.githubusercontent.com/MatthewCallis/wildberry-princess/master/wildberry-princess.png)

_-- "I found this note stabbed to my door! ... man."_

Wildberry Princess is a JavaScript library for abstracting out Google Analytics (analytics.js), and perhaps other analytics platforms in the future.

## Usage

```coffeescript
# Google Analytics initialized somewhere...

# Setup
analytics = new WildberryPrincess()

# Track user actions, specifically clicks, where the label is the text content (button, div, tab, etc.) or form input name (input, select, textarea).
# analytics.trackUserActions(selector, category, action, label, value)
analytics.trackUserActions('button', 'Button')
analytics.trackUserActions('input, select, textarea', 'Form Input')
analytics.trackUserActions('tab', 'Tab')

# Send events anywhere, like Backbone model actions.
# analytics.trackEvent(category, action, label, value)
analytics.trackEvent('Model', 'Destroy', @constructorName)
```

### Testing

```shell
npm run lint
npm test
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

![It's gunna be so flippin' awesome!](https://raw.githubusercontent.com/MatthewCallis/HotDogPrincess/master/awesome.gif)
