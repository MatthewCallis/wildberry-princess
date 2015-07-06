# Are we in iojs?
if require?
  sinon = require('sinon')
  sinonChai = require('sinon-chai')
  chai = require('chai')
  global.should = chai.should()
  global.expect = chai.expect

  chai.should()
  chai.use(sinonChai)

  WildberryPrincess = require('../build/wildberry_princess').WildberryPrincess
else
  WildberryPrincess = window.WildberryPrincess
  sinon  = window.sinon

describe 'WildberryPrincess', ->
  # Globals
  jQuery = jQuery or null
  wbp = ga_spy = kmq_spy = null
  transaction_id = transaction = item = key = value = payload = null

  beforeEach ->
    window.ga = ->
    window._kmq = {}
    window._kmq.push = (a) ->
    ga_spy = sinon.spy(window, 'ga')
    kmq_spy = sinon.spy(window._kmq, 'push')
    wbp = new WildberryPrincess()

  it 'should contruct without issue', ->
    wbp.should.be.an.instanceof(WildberryPrincess)

  it 'should have known functions', ->
    wbp.should.itself.to.respondTo('getLabel')
    wbp.should.itself.to.respondTo('trackUserActions')
    wbp.should.itself.to.respondTo('clickHandler')
    wbp.should.itself.to.respondTo('trackEvent')
    wbp.should.itself.to.respondTo('trackEventGA')
    wbp.should.itself.to.respondTo('trackEventKM')
    wbp.should.itself.to.respondTo('trackPageView')
    wbp.should.itself.to.respondTo('trackEcommerce')
    wbp.should.itself.to.respondTo('set')
    wbp.should.itself.to.respondTo('setGA')
    wbp.should.itself.to.respondTo('setKM')
    wbp.should.itself.to.respondTo('identify')
    wbp.should.itself.to.respondTo('clearIdentity')
    wbp.should.itself.to.respondTo('sendPayloadGA')
    wbp.should.itself.to.respondTo('sendPayloadKM')
    wbp.should.itself.to.respondTo('merge')

  it 'should have default setting', ->
    wbp.settings.should.have.any.keys('useGoogleAnalytics', 'useKissMetrics')
    wbp.settings.useGoogleAnalytics.should.be.true
    wbp.settings.useKissMetrics.should.be.true

  it 'should set the settings based on passed in configuration', ->
    wbp = new WildberryPrincess(useGoogleAnalytics: false)
    wbp.settings.useGoogleAnalytics.should.be.false
    wbp.settings.useKissMetrics.should.be.true

    wbp = new WildberryPrincess(useKissMetrics: false)
    wbp.settings.useGoogleAnalytics.should.be.true
    wbp.settings.useKissMetrics.should.be.false

    wbp = new WildberryPrincess(useGoogleAnalytics: false, useKissMetrics: false)
    wbp.settings.useGoogleAnalytics.should.be.false
    wbp.settings.useKissMetrics.should.be.false

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
    wbp_click_spy = ga_send_spy = km_send_spy = button = null

    beforeEach ->
      wbp_click_spy = sinon.spy(wbp, 'clickHandler')
      ga_send_spy  = sinon.spy(wbp, 'sendPayloadGA')
      km_send_spy  = sinon.spy(wbp, 'sendPayloadKM')

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
      ga_send_spy.should.have.been.calledOnce
      km_send_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledOnce
      payload =
        eventCategory: 'Buttons'
        eventAction:   'Click'
        eventLabel:    'First Button'
        hitType:       'event'
      ga_spy.should.have.been.calledWith 'send', payload
      payload = [
        "record",
        "Buttons First Button Click",
        {
          action: "Click"
          category: "Buttons"
          label: "Buttons First Button Click"
        }
      ]
      kmq_spy.should.have.been.calledWith payload

    it 'should not set a label unless it is provided', ->
      button.removeAttribute('data-event-label')
      wbp.trackUserActions('button', 'Buttons')

      # Trigger Click
      click_event = document.createEvent('HTMLEvents')
      click_event.initEvent('click', true, false)
      button.dispatchEvent(click_event)

      wbp_click_spy.should.have.been.calledOnce
      ga_send_spy.should.have.been.calledOnce
      km_send_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledOnce
      payload =
        eventCategory: 'Buttons'
        eventAction:   'Click'
        hitType:       'event'
      ga_spy.should.have.been.calledWith 'send', payload
      payload = [
        "record"
        "Buttons null Click"
        {
          action: "Click"
          category: "Buttons"
          label: "Buttons null Click"
        }
      ]
      kmq_spy.should.have.been.calledWith payload

    it 'should track clicks on elements with optional value', ->
      wbp.trackUserActions('button', 'Buttons', 'Click', null, 1)

      # Trigger Click
      click_event = document.createEvent('HTMLEvents')
      click_event.initEvent('click', true, false)
      button.dispatchEvent(click_event)

      wbp_click_spy.should.have.been.calledOnce
      ga_send_spy.should.have.been.calledOnce
      km_send_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledOnce
      payload =
        eventCategory: 'Buttons'
        eventAction:   'Click'
        eventLabel:    'First Button'
        eventValue:    1
        hitType:       'event'
      ga_spy.should.have.been.calledWith 'send', payload
      kmq_spy.should.have.been.calledOnce
      payload = [
        "record"
        "Buttons First Button Click"
        {
          action: "Click"
          category: "Buttons"
          label: "Buttons First Button Click"
          value: 1
        }
      ]
      kmq_spy.should.have.been.calledWith payload

    it 'should return when there is no event', ->
      wbp.clickHandler()

      wbp_click_spy.should.have.been.calledOnce
      ga_send_spy.should.not.have.been.calledOnce
      km_send_spy.should.not.have.been.calledOnce
      ga_spy.should.not.have.been.calledOnce
      kmq_spy.should.not.have.been.calledOnce

    it 'should not call GA when useGoogleAnalytics is false', ->
      wbp.settings.useGoogleAnalytics = false
      wbp.trackUserActions('button', 'Buttons')

      # Trigger Click
      click_event = document.createEvent('HTMLEvents')
      click_event.initEvent('click', true, false)
      button.dispatchEvent(click_event)

      wbp_click_spy.should.have.been.calledOnce
      ga_send_spy.should.not.have.been.calledOnce
      km_send_spy.should.have.been.calledOnce
      ga_spy.should.not.have.been.calledOnce
      kmq_spy.should.have.been.calledOnce

    it 'should not call KM when useGoogleAnalytics is false', ->
      wbp.settings.useKissMetrics = false
      wbp.trackUserActions('button', 'Buttons')

      # Trigger Click
      click_event = document.createEvent('HTMLEvents')
      click_event.initEvent('click', true, false)
      button.dispatchEvent(click_event)

      wbp_click_spy.should.have.been.calledOnce
      ga_send_spy.should.have.been.calledOnce
      km_send_spy.should.not.have.been.calledOnce
      kmq_spy.should.not.have.been.calledOnce

  describe '#trackEvent', ->
    track_event_ga_spy = null
    track_event_km_spy = null

    beforeEach ->
      track_event_ga_spy = sinon.spy(wbp, 'trackEventGA')
      track_event_km_spy = sinon.spy(wbp, 'trackEventKM')

    it 'should call trackEventGA when GA is enabled', ->
      track_event_ga_spy.callCount.should.equal 0
      wbp.trackEvent 'a', 'b', 'c', 'd'
      track_event_ga_spy.should.have.been.calledOnce

    it 'should not call trackEventGA when GA is disabled', ->
      wbp = new WildberryPrincess(useGoogleAnalytics: false)
      track_event_ga_spy.callCount.should.equal 0
      wbp.trackEvent 'a', 'b', 'c', 'd'
      track_event_ga_spy.callCount.should.equal 0

    it 'should call trackEventKM when KM is enabled', ->
      track_event_km_spy.callCount.should.equal 0
      wbp.trackEvent 'a', 'b', 'c', 'd'
      track_event_km_spy.should.have.been.calledOnce

    it 'should call trackEventKM with the correct params', ->
      track_event_km_spy.callCount.should.equal 0
      wbp.trackEvent 'a', 'b', 'c', 'd'
      track_event_km_spy.should.have.been.calledWith 'a c b', { action: "b", category: "a", label: "a c b", value: "d" }

    it 'should not call trackEventKM when KM is disabled', ->
      wbp = new WildberryPrincess(useKissMetrics: false)
      track_event_km_spy.callCount.should.equal 0
      wbp.trackEvent 'a', 'b', 'c', 'd'
      track_event_km_spy.callCount.should.equal 0

  describe '#trackEventGA', ->
    wbp_spy = null

    beforeEach ->
      wbp_spy = sinon.spy(wbp, 'sendPayloadGA')

    it 'should track the event', ->
      wbp.trackEventGA 'a', 'b', 'c', 'd'

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
      wbp.trackEventGA 'a', 'b', null, 'd'

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
      wbp.trackEventGA 'a', 'b', 'c'

      payload =
        eventCategory: 'a'
        eventAction:   'b'
        eventLabel:    'c'
        hitType:       'event'

      wbp_spy.should.have.been.calledOnce
      wbp_spy.should.have.been.calledWith payload

      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

  describe '#trackEventKM', ->
    wbp_spy = null

    beforeEach ->
      wbp_spy = sinon.spy(wbp, 'sendPayloadKM')

    it 'should track the event using sendPayloadKM', ->
      wbp.trackEventKM '!label', { '!key': '!value' }

      wbp_spy.should.have.been.calledOnce
      wbp_spy.should.have.been.calledWith 'record', '!label', { '!key': '!value' }

    it 'should send the event to KissMetrics', ->
      wbp.trackEventKM '!label', { '!key': '!value' }

      payload = {}

      kmq_spy.should.have.been.calledOnce
      kmq_spy.should.have.been.calledWith ['record', '!label', { '!key': '!value' }]

  describe '#trackPageView', ->
    wbp_spy = null

    beforeEach ->
      wbp_spy = sinon.spy(wbp, 'sendPayloadGA')

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

  describe '#trackEcommerce', ->
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
    setga_spy = null
    setkm_spy = null

    beforeEach ->
      setga_spy = sinon.spy(wbp, 'setGA')
      setkm_spy = sinon.spy(wbp, 'setKM')

      key = 'my-key'
      value = 'my-value'

    it 'should call setGA when GA is enabled', ->
      setga_spy.callCount.should.equal 0
      wbp.set key, value
      setga_spy.should.have.been.calledOnce

    it 'should not call setGA when GA is disabled', ->
      wbp = new WildberryPrincess(useGoogleAnalytics: false)
      setga_spy.callCount.should.equal 0
      wbp.set key, value
      setga_spy.callCount.should.equal 0

    it 'should call setKM when KM is enabled', ->
      setkm_spy.callCount.should.equal 0
      wbp.set key, value
      setkm_spy.should.have.been.calledOnce

    it 'should not call setKM when KM is disabled', ->
      wbp = new WildberryPrincess(useKissMetrics: false)
      setkm_spy.callCount.should.equal 0
      wbp.set key, value
      setkm_spy.callCount.should.equal 0

  describe '#setGA', ->
    beforeEach ->
      key = 'my-key'
      value = 'my-value'

    it 'should set the key to the value when there is GA', ->
      ga_spy.callCount.should.equal 0
      wbp.setGA key, value
      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'set', key, value

    it 'should not set the key to the value when there is no GA', ->
      window.ga = null
      ga_spy.callCount.should.equal 0
      wbp.setGA key, value
      ga_spy.should.not.have.been.calledOnce

  describe '#setKM', ->
    beforeEach ->
      key = 'my-key'
      value = 'my-value'

    it 'should set the key to the value when there is KM', ->
      kmq_spy.callCount.should.equal 0
      wbp.setKM key, value
      kmq_spy.should.have.been.calledOnce
      output = {}
      output[key] = value
      kmq_spy.should.have.been.calledWith ['set', output]

    it 'should not set the key to the value when there is no MK', ->
      window._kmq = null
      kmq_spy.callCount.should.equal 0
      wbp.setKM key, value
      kmq_spy.should.not.have.been.calledOnce

  describe '#identify', ->
    setga_spy = null

    beforeEach ->
      setga_spy = sinon.spy(wbp, 'setGA')

    it 'should not call setGA when GA is enabled without a user_ID', ->
      setga_spy.callCount.should.equal 0
      wbp.identify()
      setga_spy.callCount.should.equal 0

    it 'should call setGA when GA is enabled with an user_id', ->
      setga_spy.callCount.should.equal 0
      wbp.identify('1234')
      setga_spy.should.have.been.calledOnce
      setga_spy.should.have.been.calledWith 'userId', '1234'

    it 'should not call setGA when GA is disabled', ->
      wbp = new WildberryPrincess(useGoogleAnalytics: false)
      setga_spy.callCount.should.equal 0
      wbp.identify key, value
      setga_spy.callCount.should.equal 0

    it 'should call setKM when KM is enabled', ->
      kmq_spy.callCount.should.equal 0
      wbp.identify()
      kmq_spy.should.have.been.calledOnce
      kmq_spy.should.have.been.calledWith ['identify', 'anonymous']

    it 'should call setKM when KM is enabled with an user_id', ->
      kmq_spy.callCount.should.equal 0
      wbp.identify('1234')
      kmq_spy.should.have.been.calledOnce
      kmq_spy.should.have.been.calledWith ['identify', '1234']

    it 'should not call setKM when KM is disabled', ->
      wbp = new WildberryPrincess(useKissMetrics: false)
      kmq_spy.callCount.should.equal 0
      wbp.identify key, value
      kmq_spy.callCount.should.equal 0

  describe '#clearIdentity', ->
    it 'should call sendPayloadKM when KM is enabled', ->
      kmq_spy.callCount.should.equal 0
      wbp.clearIdentity()
      kmq_spy.should.have.been.calledOnce
      kmq_spy.should.have.been.calledWith ['clearIdentity']

    it 'should not call sendPayloadKM when KM is disabled', ->
      wbp = new WildberryPrincess(useKissMetrics: false)
      kmq_spy.callCount.should.equal 0
      wbp.clearIdentity key, value
      kmq_spy.callCount.should.equal 0

  describe '#sendPayloadGA', ->
    beforeEach ->
      payload =
        hitType: 'event'
        eventCategory: 'my-category'
        eventAction: 'my-action'
        eventLabel: 'my-label'
        eventValue: 'my-value'

    it 'should send the payload when there is GA', ->
      ga_spy.callCount.should.equal 0
      wbp.sendPayloadGA payload
      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

    it 'should not send the payload when there is no GA', ->
      window.ga = null
      ga_spy.callCount.should.equal 0
      wbp.sendPayloadGA payload
      ga_spy.should.not.have.been.calledOnce

  describe '#sendPayloadKM', ->
    it 'should send the full payload when there is KM', ->
      payload = ['record', 'event', { 'event-data': '1' }]

      kmq_spy.callCount.should.equal 0
      wbp.sendPayloadKM('record', 'event', { 'event-data': '1' })
      kmq_spy.should.have.been.calledOnce
      kmq_spy.should.have.been.calledWith payload

    it 'should send the partial payload when there is KM', ->
      payload = ['record', 'event']

      kmq_spy.callCount.should.equal 0
      wbp.sendPayloadKM('record', 'event')
      kmq_spy.should.have.been.calledOnce
      kmq_spy.should.have.been.calledWith payload

    it 'should send the action-only payload when there is KM', ->
      payload = ['record']

      kmq_spy.callCount.should.equal 0
      wbp.sendPayloadKM('record')
      kmq_spy.should.have.been.calledOnce
      kmq_spy.should.have.been.calledWith payload

    it 'should not send the payload when there is no KM', ->
      payload = ['record']

      window._kmq = null
      kmq_spy.callCount.should.equal 0
      wbp.sendPayloadKM payload
      kmq_spy.should.not.have.been.calledOnce

  describe '#merge', ->
    it 'should merge objects', ->
      defaults =
        useGoogleAnalytics: true
        useKissMetrics: true

      options =
        useGoogleAnalytics: false
        useKissMetrics: false
        useOther: true

      output = wbp.merge(defaults, options)
      output.should.deep.equal options
