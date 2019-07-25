export default class WildberryPrincess {
  constructor(options = {}) {
    this.trackUserActions = this.trackUserActions.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.trackEvent = this.trackEvent.bind(this);
    this.trackPageView = this.trackPageView.bind(this);
    this.trackEcommerce = this.trackEcommerce.bind(this);
    this.set = this.set.bind(this);
    this.identify = this.identify.bind(this);
    this.clearIdentity = this.clearIdentity.bind(this);

    const defaults = {
      useGoogleAnalytics: true,
      useKissMetrics: true,
      useFullStory: true,
      useSegment: true,
      useCustomerio: true,
    };
    this.settings = Object.assign({}, defaults, options);
  }

  trackUserActions(selector, category, action, label, value) {
    const params = {
      category,
      action: action || 'Click',
    };
    if (label) { params.label = label; }
    if (value) { params.value = value; }

    const elements = document.querySelectorAll(selector);
    let i = 0;

    const result = [];
    while (i < elements.length) {
      elements[i].data = { eventParams: params };
      elements[i].removeEventListener('click', this.clickHandler);
      elements[i].addEventListener('click', this.clickHandler, false);
      result.push(i++);
    }
  }

  clickHandler(event) {
    if (event == null) { return; }
    const element = event.target;
    if (element == null) { return; }

    const { eventParams } = element.data;
    const label = eventParams.label ? eventParams.label : this.getLabel(element);

    if (this.settings.useGoogleAnalytics) {
      const payload = {
        hitType: 'event',
        eventCategory: eventParams.category,
        eventAction: eventParams.action,
      };
      if (label) { payload.eventLabel = label; }
      if (eventParams.value) { payload.eventValue = eventParams.value; }

      this.sendPayloadGA(payload);
    }

    if (this.settings.useKissMetrics) {
      const payload = {
        category: eventParams.category,
        action: eventParams.action,
      };
      if (label) { payload.label = label; }
      if (eventParams.value) { payload.value = eventParams.value; }

      this.trackEventKM(`${eventParams.category}: ${label} (${eventParams.action})`, payload);
    }
  }

  trackEvent(category, action, label, value) {
    if (this.settings.useGoogleAnalytics) {
      this.trackEventGA(category, action, label, value);
    }

    if (this.settings.useKissMetrics) {
      const payload = {
        category,
        action,
      };
      if (label) { payload.label = label; }
      if (value) { payload.value = value; }

      this.trackEventKM(`${category}: ${label} (${action})`, payload);
    }

    if (this.settings.useSegment) {
      const properties = {
        category,
      };
      if (label) { properties.label = label; }
      if (value) { properties.value = value; }

      this.trackEventSegment(action, properties);
    }

    if (this.settings.useCustomerio) {
      const properties = {
        category,
      };
      if (label) { properties.label = label; }
      if (value) { properties.value = value; }

      this.trackEventCustomerio(action, properties);
    }
  }

  trackPageView(page, title) {
    if (!page) { page = window.location.pathname; }
    if (!title) { ({ title } = document); }
    const payload = {
      hitType: 'pageview',
      page,
      title,
    };

    if (this.settings.useGoogleAnalytics) {
      this.sendPayloadGA(payload);
    }
  }

  trackEcommerce(action, payload) {
    if ((window.ga != null) && this.settings.useGoogleAnalytics) {
      window.ga(`ecommerce:${action}`, payload);
    }
  }

  set(key, value) {
    if (this.settings.useGoogleAnalytics) {
      this.setGA(key, value);
    }
    if (this.settings.useKissMetrics) {
      this.setKM(key, value);
    }
  }

  identify(user = { id: 'anonymous' }) {
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
    // Pass in customFields if provided - must be in the FullStory userVars format - see above
    if (this.settings.useFullStory && window.FS != null && user.id !== 'anonymous') {
      window.FS.identify(user.id, {
        displayName: user.name,
        email: user.email,
        ...user.customFields,
      });
    }

    // https://segment.com/docs/spec/identify/
    if (this.settings.useSegment && user.id !== 'anonymous') {
      if (window.analytics != null) {
        window.analytics.identify(user.id, {
          name: user.name,
          email: user.email,
        });
      }
    }

    // https://customer.io/docs/api/javascript.html
    if (this.settings.useCustomerio && user.id !== 'anonymous') {
      if (window._cio != null) {
        window._cio.identify({
          id: user.id,
          name: user.name,
          email: user.email,
        });
      }
    }
  }

  clearIdentity() {
    // http://support.kissmetrics.com/advanced/multiple-people-same-browser/
    if (this.settings.useKissMetrics) {
      this.sendPayloadKM('clearIdentity');
    }
  }

  // Static / Class Methods
  getLabel(element) {
    return element.getAttribute('data-event-label');
  }

  trackEventGA(category, action, label, value) {
    const payload = {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
    };
    if (label) { payload.eventLabel = label; }
    if (value) { payload.eventValue = value; }

    this.sendPayloadGA(payload);
  }

  trackEventKM(label, payload) {
    this.sendPayloadKM('record', label, payload);
  }

  trackEventSegment(event, properties = {}, options = {}) {
    if (window.analytics != null) {
      window.analytics.track(event, properties, options);
    }
  }

  trackEventCustomerio(event, properties = {}) {
    if (window._cio != null) {
      window._cio.track(event, properties);
    }
  }

  setGA(key, value) {
    if (window.ga != null) {
      window.ga('set', key, value);
    }
  }

  setKM(key, value) {
    const data = {};
    data[key] = value;
    this.sendPayloadKM('set', data, null);
  }

  sendPayloadGA(payload) {
    if (window.ga != null) {
      window.ga('send', payload);
    }
  }

  sendPayloadKM(action, payload, data) {
    // http://support.kissmetrics.com/apis/common-methods
    if (window._kmq != null) {
      const output = [action];
      if (payload) { output.push(payload); }
      if (data) { output.push(data); }

      window._kmq.push(output);
    }
  }
}
