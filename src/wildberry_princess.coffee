# https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
# https://developers.google.com/analytics/devguides/collection/analyticsjs/events
# https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
class WildberryPrincess
  constructor: ->

  getLabel: (element) ->
    element.getAttribute('data-event-label')

  trackUserActions: (selector, category, action, label, value) ->
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
    element = event.target
    eventParams = element.data?.eventParams

    return  unless eventParams

    label = @getLabel(element)  unless label = eventParams.label

    payload =
      hitType: 'event'
      eventCategory: eventParams.category
      eventAction:   eventParams.action
    payload.eventLabel = label  if label
    payload.eventValue = eventParams.value  if eventParams.value

    @sendPayload payload

    return

  trackEvent: (category, action, label, value) ->
    payload =
      hitType: 'event'
      eventCategory: category
      eventAction:   action
    payload.eventLabel = label  if label
    payload.eventValue = value  if value

    @sendPayload payload

  sendPayload: (payload) ->
    if window.ga?
      window.ga 'send', payload

(exports ? this).WildberryPrincess = WildberryPrincess
