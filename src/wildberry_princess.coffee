# https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
# https://developers.google.com/analytics/devguides/collection/analyticsjs/events
# https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
# https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
class WildberryPrincess
  defaults =
    useGoogleAnalytics: true
    useKissMetrics: true

  constructor: (options = {}) ->
    @settings = @merge(defaults, options)

  getLabel: (element) ->
    element.getAttribute('data-event-label')

  trackUserActions: (selector, category, action, label, value) =>
    params =
      category: category
      action:   action or 'Click'
    params.label = label  if label
    params.value = value  if value

    elements = document.querySelectorAll(selector)
    i = 0
    while i < elements.length
      elements[i].data =
        eventParams: params
      elements[i].removeEventListener 'click', @clickHandler
      elements[i].addEventListener 'click', @clickHandler, false
      i++

  clickHandler: (event) =>
    return unless event
    element = event.target
    return unless element

    eventParams = element.data.eventParams

    label = if eventParams.label then eventParams.label else @getLabel(element)

    if @settings.useGoogleAnalytics
      payload =
        hitType: 'event'
        eventCategory: eventParams.category
        eventAction:   eventParams.action
      payload.eventLabel = label  if label
      payload.eventValue = eventParams.value  if eventParams.value

      @sendPayloadGA payload

    if @settings.useKissMetrics
      payload =
        category: eventParams.category
        action:   eventParams.action
      payload.label = label  if label
      payload.value = eventParams.value  if eventParams.value

      @trackEventKM "#{eventParams.category}: #{label} (#{eventParams.action})", payload

    return

  trackEvent: (category, action, label, value) =>
    if @settings.useGoogleAnalytics
      @trackEventGA(category, action, label, value)

    if @settings.useKissMetrics
      payload =
        category: category
        action:   action
      payload.label = label  if label
      payload.value = value  if value

      @trackEventKM "#{category}: #{label} (#{action})", payload

  trackEventGA: (category, action, label, value) =>
    payload =
      hitType: 'event'
      eventCategory: category
      eventAction:   action
    payload.eventLabel = label  if label
    payload.eventValue = value  if value

    @sendPayloadGA payload

  trackEventKM: (label, payload) =>
    @sendPayloadKM 'record', label, payload

  trackPageView: (page, title) =>
    page or= window.location.pathname
    title or= document.title
    payload =
      hitType: 'pageview'
      page: page
      title: title

    @sendPayloadGA payload

  trackEcommerce: (action, payload) =>
    if window.ga? and @settings.useGoogleAnalytics
      window.ga "ecommerce:#{action}", payload

  set: (key, value) =>
    @setGA(key, value) if @settings.useGoogleAnalytics
    if @settings.useKissMetrics
      @setKM(key, value)

  setGA: (key, value) ->
    if window.ga?
      window.ga 'set', key, value

  setKM: (key, value) =>
    data = {}
    data[key] = value
    @sendPayloadKM('set', data, null)

  identify: (user_id = 'anonymous') =>
    # https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id
    # https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#userId
    # http://support.kissmetrics.com/apis/common-methods#identify
    @setGA('userId', user_id) if @settings.useGoogleAnalytics and user_id isnt 'anonymous'
    @sendPayloadKM('identify', user_id) if @settings.useKissMetrics

  clearIdentity: =>
    # http://support.kissmetrics.com/advanced/multiple-people-same-browser/
    @sendPayloadKM('clearIdentity') if @settings.useKissMetrics

  sendPayloadGA: (payload) ->
    if window.ga?
      window.ga 'send', payload

  sendPayloadKM: (action, payload, data) ->
    # http://support.kissmetrics.com/apis/common-methods
    if window._kmq?
      output = [action]
      output.push payload if payload
      output.push data if data

      window._kmq.push output

  merge: (input, options) ->
    output = JSON.parse(JSON.stringify(input))
    output[k] = v  for k, v of options
    output

(exports ? this).WildberryPrincess = WildberryPrincess
