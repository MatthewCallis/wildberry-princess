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







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

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
      useKissMetrics: true
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
    value: function set(key, value) {
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
      var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'anonymous';

      // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#userId
      // http://support.kissmetrics.com/apis/common-methods#identify
      if (this.settings.useGoogleAnalytics && user_id !== 'anonymous') {
        this.setGA('userId', user_id);
      }
      if (this.settings.useKissMetrics) {
        this.sendPayloadKM('identify', user_id);
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

export default WildberryPrincess;
