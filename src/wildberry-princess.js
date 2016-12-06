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

  identify(user_id = 'anonymous') {
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
