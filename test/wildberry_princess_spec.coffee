# Are we in iojs?
if require?
  sinon = require('sinon')
  sinonChai = require('sinon-chai')
  chai = require('chai')
  global.should = chai.should()
  global.expect = chai.expect
  jsdom = require('mocha-jsdom')

  chai.should()
  chai.use(sinonChai)

  WildberryPrincess = require('../build/wildberry_princess').WildberryPrincess

  jsdom()
else
  WildberryPrincess = window.WildberryPrincess
  sinon  = window.sinon

describe 'WildberryPrincess', ->
  # Globals
  jQuery = jQuery or null
  wbp = ga_spy = null
  transaction_id = transaction = item = key = value = payload = null

  beforeEach ->
    window.ga = ->
    ga_spy = sinon.spy(window, 'ga')
    wbp = new WildberryPrincess()

  it 'should contruct without issue', ->
    wbp.should.be.an.instanceof(WildberryPrincess)

  it 'should have known functions', ->
    wbp.should.itself.to.respondTo('trackUserActions')
    wbp.should.itself.to.respondTo('clickHandler')
    wbp.should.itself.to.respondTo('trackEvent')
    wbp.should.itself.to.respondTo('sendPayload')

  describe '#trackUserActions', ->
    wbp_spy = null

    beforeEach ->
      wbp_spy = sinon.spy(wbp, 'trackUserActions')

      button = document.createElement('button')
      button.textConent = 'First Button'
      button.setAttribute('data-event-label', 'First Button')
      document.body.appendChild button

    it 'should add data and click handlers to the elements', ->
      wbp.trackUserActions('button', 'Buttons')

      wbp_spy.should.have.been.calledOnce

      event_data = document.querySelector('button').data
      event_data.should.have.property('eventParams')
      event_data.eventParams.should.have.keys('category', 'action')

    it 'should add label and value data when supplied', ->
      wbp.trackUserActions('button', 'Buttons', 'Click', 'Label', 1)

      wbp_spy.should.have.been.calledOnce

      event_data = document.querySelector('button').data
      event_data.should.have.property('eventParams')
      event_data.eventParams.should.have.keys('category', 'action', 'label', 'value')

  describe '#clickHandler', ->
    wbp_click_spy = wbp_send_spy = button = null

    beforeEach ->
      wbp_click_spy = sinon.spy(wbp, 'clickHandler')
      wbp_send_spy  = sinon.spy(wbp, 'sendPayload')

      button = document.createElement('button')
      button.innerText = 'First Button'
      button.setAttribute('data-event-label', 'First Button')
      document.body.appendChild button

    it 'should track clicks on elements', ->
      wbp.trackUserActions('button', 'Buttons')

      # Trigger Click
      click_event = document.createEvent('HTMLEvents')
      click_event.initEvent('click', true, false)
      button.dispatchEvent(click_event)

      wbp_click_spy.should.have.been.calledOnce
      wbp_send_spy.should.have.been.calledOnce
      window.ga.should.have.been.calledOnce
      payload =
        eventCategory: 'Buttons'
        eventAction:   'Click'
        eventLabel:    'First Button'
        hitType:       'event'
      window.ga.should.have.been.calledWith 'send', payload

    it 'should not set a label unless it is provided', ->
      button.removeAttribute('data-event-label')
      wbp.trackUserActions('button', 'Buttons')

      # Trigger Click
      click_event = document.createEvent('HTMLEvents')
      click_event.initEvent('click', true, false)
      button.dispatchEvent(click_event)

      wbp_click_spy.should.have.been.calledOnce
      wbp_send_spy.should.have.been.calledOnce
      window.ga.should.have.been.calledOnce
      payload =
        eventCategory: 'Buttons'
        eventAction:   'Click'
        hitType:       'event'
      window.ga.should.have.been.calledWith 'send', payload

    it 'should track clicks on elements with optional value', ->
      wbp.trackUserActions('button', 'Buttons', 'Click', null, 1)

      # Trigger Click
      click_event = document.createEvent('HTMLEvents')
      click_event.initEvent('click', true, false)
      button.dispatchEvent(click_event)

      wbp_click_spy.should.have.been.calledOnce
      wbp_send_spy.should.have.been.calledOnce
      window.ga.should.have.been.calledOnce
      payload =
        eventCategory: 'Buttons'
        eventAction:   'Click'
        eventLabel:    'First Button'
        eventValue:    1
        hitType:       'event'
      window.ga.should.have.been.calledWith 'send', payload

    it 'should return when there is no event', ->
      wbp.clickHandler()

      wbp_click_spy.should.have.been.calledOnce
      wbp_send_spy.should.not.have.been.calledOnce
      window.ga.should.not.have.been.calledOnce

  describe '#trackEvent', ->
    wbp_spy = null

    beforeEach ->
      wbp_spy = sinon.spy(wbp, 'sendPayload')

    it 'should track the event', ->
      wbp.trackEvent 'a', 'b', 'c', 'd'

      payload =
        eventCategory: 'a'
        eventAction:   'b'
        eventLabel:    'c'
        eventValue:    'd'
        hitType:       'event'

      wbp_spy.should.have.been.calledOnce
      wbp_spy.should.have.been.calledWith payload

      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

    it 'should track the event without a label', ->
      wbp.trackEvent 'a', 'b', null, 'd'

      payload =
        eventCategory: 'a'
        eventAction:   'b'
        eventValue:    'd'
        hitType:       'event'

      wbp_spy.should.have.been.calledOnce
      wbp_spy.should.have.been.calledWith payload

      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

    it 'should track the event without a value', ->
      wbp.trackEvent 'a', 'b', 'c'

      payload =
        eventCategory: 'a'
        eventAction:   'b'
        eventLabel:    'c'
        hitType:       'event'

      wbp_spy.should.have.been.calledOnce
      wbp_spy.should.have.been.calledWith payload

      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

  describe '#trackPageView', ->
    wbp_spy = null

    beforeEach ->
      wbp_spy = sinon.spy(wbp, 'sendPayload')

    it 'should track the page view', ->
      wbp.trackPageView 'a', 'b'

      payload =
        page:    'a'
        title:   'b'
        hitType: 'pageview'

      wbp_spy.should.have.been.calledOnce
      wbp_spy.should.have.been.calledWith payload

      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

    it 'should track the page view without a page provided', ->
      wbp.trackPageView null, 'b'

      payload =
        page:    window.location.pathname
        title:   'b'
        hitType: 'pageview'

      wbp_spy.should.have.been.calledOnce
      wbp_spy.should.have.been.calledWith payload

      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

    it 'should track the page view without a title', ->
      wbp.trackPageView 'a', null

      payload =
        page:    'a'
        title:   'Mocha'
        hitType: 'pageview'

      wbp_spy.should.have.been.calledOnce
      wbp_spy.should.have.been.calledWith payload

      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

  describe '#sendPayload', ->
    beforeEach ->
      transaction_id = "#{Date.now()}"
      transaction =
        id:          transaction_id
        affiliation: "Candy Kingdom"
        revenue:     123
        shipping:    '0'
        tax:         '0'

      item =
        id:       transaction_id
        name:     'b'
        category: 'a'
        price:    123
        quantity: 1

    it 'should send the payload when there is GA', ->
      ga_spy.callCount.should.equal 0

      wbp.trackEcommerce('clear')
      ga_spy.should.have.been.calledWith 'ecommerce:clear'

      wbp.trackEcommerce('addTransaction', transaction)
      ga_spy.should.have.been.calledWith 'ecommerce:addTransaction', transaction

      wbp.trackEcommerce('addItem', item)
      ga_spy.should.have.been.calledWith 'ecommerce:addItem', item

      wbp.trackEcommerce('send')
      ga_spy.should.have.been.calledWith 'ecommerce:send'

    it 'should not send the payload when there is no GA', ->
      window.ga = null

      ga_spy.callCount.should.equal 0

      wbp.trackEcommerce('clear')
      ga_spy.should.not.have.been.calledOnce

      wbp.trackEcommerce('addTransaction', transaction)
      ga_spy.should.not.have.been.calledOnce

      wbp.trackEcommerce('addItem', item)
      ga_spy.should.not.have.been.calledOnce

      wbp.trackEcommerce('send')
      ga_spy.should.not.have.been.calledOnce

  describe '#set', ->
    beforeEach ->
      key = 'my-key'
      value = 'my-value'

    it 'should set the key to the value when there is GA', ->
      ga_spy.callCount.should.equal 0
      wbp.set key, value
      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'set', key, value

    it 'should set the key to the value when there is GA', ->
      window.ga = null
      ga_spy.callCount.should.equal 0
      wbp.set key, value
      ga_spy.should.not.have.been.calledOnce

  describe '#sendPayload', ->
    beforeEach ->
      payload =
        hitType: 'event'
        eventCategory: 'my-category'
        eventAction: 'my-action'
        eventLabel: 'my-label'
        eventValue: 'my-value'

    it 'should send the payload when there is GA', ->
      ga_spy.callCount.should.equal 0
      wbp.sendPayload payload
      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

    it 'should not send the payload when there is no GA', ->
      window.ga = null
      ga_spy.callCount.should.equal 0
      wbp.sendPayload payload
      ga_spy.should.not.have.been.calledOnce
