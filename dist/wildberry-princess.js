'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var WildberryPrincess = function () {
  function WildberryPrincess() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, WildberryPrincess);

    this.trackUserActions = this.trackUserActions.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.trackEvent = this.trackEvent.bind(this);
    this.trackPageView = this.trackPageView.bind(this);
    this.trackEcommerce = this.trackEcommerce.bind(this);
    this.set = this.set.bind(this);
    this.identify = this.identify.bind(this);
    this.clearIdentity = this.clearIdentity.bind(this);

    var defaults$$1 = {
      useGoogleAnalytics: true,
      useKissMetrics: true,
      useFullStory: true,
      useSegment: true,
      useCustomerio: true
    };
    this.settings = Object.assign({}, defaults$$1, options);
  }

  createClass(WildberryPrincess, [{
    key: 'trackUserActions',
    value: function trackUserActions(selector, category, action, label, value) {
      var params = {
        category: category,
        action: action || 'Click'
      };
      if (label) {
        params.label = label;
      }
      if (value) {
        params.value = value;
      }

      var elements = document.querySelectorAll(selector);
      var i = 0;

      var result = [];
      while (i < elements.length) {
        elements[i].data = { eventParams: params };
        elements[i].removeEventListener('click', this.clickHandler);
        elements[i].addEventListener('click', this.clickHandler, false);
        result.push(i++);
      }
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler(event) {
      if (event == null) {
        return;
      }
      var element = event.target;
      if (element == null) {
        return;
      }

      var eventParams = element.data.eventParams;

      var label = eventParams.label ? eventParams.label : this.getLabel(element);

      if (this.settings.useGoogleAnalytics) {
        var payload = {
          hitType: 'event',
          eventCategory: eventParams.category,
          eventAction: eventParams.action
        };
        if (label) {
          payload.eventLabel = label;
        }
        if (eventParams.value) {
          payload.eventValue = eventParams.value;
        }

        this.sendPayloadGA(payload);
      }

      if (this.settings.useKissMetrics) {
        var _payload = {
          category: eventParams.category,
          action: eventParams.action
        };
        if (label) {
          _payload.label = label;
        }
        if (eventParams.value) {
          _payload.value = eventParams.value;
        }

        this.trackEventKM(eventParams.category + ': ' + label + ' (' + eventParams.action + ')', _payload);
      }
    }
  }, {
    key: 'trackEvent',
    value: function trackEvent(category, action, label, value) {
      if (this.settings.useGoogleAnalytics) {
        this.trackEventGA(category, action, label, value);
      }

      if (this.settings.useKissMetrics) {
        var payload = {
          category: category,
          action: action
        };
        if (label) {
          payload.label = label;
        }
        if (value) {
          payload.value = value;
        }

        this.trackEventKM(category + ': ' + label + ' (' + action + ')', payload);
      }

      if (this.settings.useSegment) {
        var properties = {
          category: category
        };
        if (label) {
          properties.label = label;
        }
        if (value) {
          properties.value = value;
        }

        this.trackEventSegment(action, properties);
      }

      if (this.settings.useCustomerio) {
        var _properties = {
          category: category
        };
        if (label) {
          _properties.label = label;
        }
        if (value) {
          _properties.value = value;
        }

        this.trackEventCustomerio(action, _properties);
      }
    }
  }, {
    key: 'trackPageView',
    value: function trackPageView(page, title) {
      if (!page) {
        page = window.location.pathname;
      }
      if (!title) {
        var _document = document;
        title = _document.title;
      }
      var payload = {
        hitType: 'pageview',
        page: page,
        title: title
      };

      if (this.settings.useGoogleAnalytics) {
        this.sendPayloadGA(payload);
      }
    }
  }, {
    key: 'trackEcommerce',
    value: function trackEcommerce(action, payload) {
      if (window.ga != null && this.settings.useGoogleAnalytics) {
        window.ga('ecommerce:' + action, payload);
      }
    }
  }, {
    key: 'set',
    value: function set$$1(key, value) {
      if (this.settings.useGoogleAnalytics) {
        this.setGA(key, value);
      }
      if (this.settings.useKissMetrics) {
        this.setKM(key, value);
      }
    }
  }, {
    key: 'identify',
    value: function identify() {
      var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { id: 'anonymous' };

      // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#userId
      // http://support.kissmetrics.com/apis/common-methods#identify
      if (this.settings.useGoogleAnalytics && user.id !== 'anonymous') {
        this.setGA('userId', user.id);
      }
      if (this.settings.useKissMetrics) {
        this.sendPayloadKM('identify', user.id);
      }

      // http://help.fullstory.com/develop-js/identify
      // http://help.fullstory.com/develop-js/setuservars
      if (this.settings.useFullStory && window.FS != null && user.id !== 'anonymous') {
        window.FS.identify(user.id, {
          displayName: user.name,
          email: user.email
        });
      }

      // https://segment.com/docs/spec/identify/
      if (this.settings.useSegment && user.id !== 'anonymous') {
        if (window.analytics != null) {
          window.analytics.identify(user.id, {
            name: user.name,
            email: user.email
          });
        }
      }

      // https://customer.io/docs/api/javascript.html
      if (this.settings.useCustomerio && user.id !== 'anonymous') {
        if (window._cio != null) {
          window._cio.identify({
            id: user.id,
            name: user.name,
            email: user.email
          });
        }
      }
    }
  }, {
    key: 'clearIdentity',
    value: function clearIdentity() {
      // http://support.kissmetrics.com/advanced/multiple-people-same-browser/
      if (this.settings.useKissMetrics) {
        this.sendPayloadKM('clearIdentity');
      }
    }

    // Static / Class Methods

  }, {
    key: 'getLabel',
    value: function getLabel(element) {
      return element.getAttribute('data-event-label');
    }
  }, {
    key: 'trackEventGA',
    value: function trackEventGA(category, action, label, value) {
      var payload = {
        hitType: 'event',
        eventCategory: category,
        eventAction: action
      };
      if (label) {
        payload.eventLabel = label;
      }
      if (value) {
        payload.eventValue = value;
      }

      this.sendPayloadGA(payload);
    }
  }, {
    key: 'trackEventKM',
    value: function trackEventKM(label, payload) {
      this.sendPayloadKM('record', label, payload);
    }
  }, {
    key: 'trackEventSegment',
    value: function trackEventSegment(event) {
      var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (window.analytics != null) {
        window.analytics.track(event, properties, options);
      }
    }
  }, {
    key: 'trackEventCustomerio',
    value: function trackEventCustomerio(event) {
      var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (window._cio != null) {
        window._cio.track(event, properties);
      }
    }
  }, {
    key: 'setGA',
    value: function setGA(key, value) {
      if (window.ga != null) {
        window.ga('set', key, value);
      }
    }
  }, {
    key: 'setKM',
    value: function setKM(key, value) {
      var data = {};
      data[key] = value;
      this.sendPayloadKM('set', data, null);
    }
  }, {
    key: 'sendPayloadGA',
    value: function sendPayloadGA(payload) {
      if (window.ga != null) {
        window.ga('send', payload);
      }
    }
  }, {
    key: 'sendPayloadKM',
    value: function sendPayloadKM(action, payload, data) {
      // http://support.kissmetrics.com/apis/common-methods
      if (window._kmq != null) {
        var output = [action];
        if (payload) {
          output.push(payload);
        }
        if (data) {
          output.push(data);
        }

        window._kmq.push(output);
      }
    }
  }]);
  return WildberryPrincess;
}();

module.exports = WildberryPrincess;
