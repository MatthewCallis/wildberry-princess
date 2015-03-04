sinon = require('sinon')
sinonChai = require('sinon-chai')
chai = require('chai')
should = chai.should()

jsdom = require('mocha-jsdom')

chai.should()
chai.use(sinonChai)

WildberryPrincess = require('../wildberry_princess').WildberryPrincess

describe 'WildberryPrincess', ->
  # Globals
  wbp = ga_spy = null
  jsdom()

  beforeEach ->
    global.window.ga = ->
    ga_spy = sinon.spy(global.window, 'ga')
    wbp = new WildberryPrincess()
    return

  it 'should contruct without issue', ->
    wbp.should.be.an.instanceof(WildberryPrincess)
    return

  it 'should have known functions', ->
    wbp.should.itself.to.respondTo('trackUserActions')
    wbp.should.itself.to.respondTo('clickHandler')
    wbp.should.itself.to.respondTo('trackEvent')
    wbp.should.itself.to.respondTo('sendPayload')
    return

  describe '#trackUserActions', ->
    it 'should add data and click handlers to the elements', ->
      wbp_spy = sinon.spy(wbp, 'trackUserActions')

      button = document.createElement('button')
      button.textConent = 'First Button'
      document.body.appendChild button

      wbp.trackUserActions('button', 'Buttons')

      wbp_spy.should.have.been.calledOnce

      event_data = document.querySelector('button').data
      event_data.should.have.property('eventParams')
      event_data.eventParams.should.have.keys('category', 'action')

  describe '#clickHandler', ->
    it 'should track clicks on elements', ->
      wbp_click_spy = sinon.spy(wbp, 'clickHandler')
      wbp_send_spy  = sinon.spy(wbp, 'sendPayload')

      button = document.createElement('button')
      button.innerText = 'First Button'
      document.body.appendChild button

      wbp.trackUserActions('button', 'Buttons')

      # Trigger Click
      click_event = document.createEvent('HTMLEvents')
      click_event.initEvent('click', true, false)
      button.dispatchEvent(click_event)

      wbp_click_spy.should.have.been.calledOnce
      wbp_send_spy.should.have.been.calledOnce
      global.window.ga.should.have.been.calledOnce
      payload =
        eventCategory: 'Buttons'
        eventAction:   'Click'
        eventLabel:    'First Button'
        hitType:       'event'
      global.window.ga.should.have.been.calledWith 'send', payload

      return

    return

  describe '#trackEvent', ->
    it 'should track the event', ->
      wbp_spy = sinon.spy(wbp, 'sendPayload')

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

      return

    return

  describe '#sendPayload', ->
    it 'should send the payload', ->
      ga_spy.callCount.should.equal 0

      payload =
        hitType: 'event'
        eventCategory: 'my-category'
        eventAction: 'my-action'
        eventLabel: 'my-label'
        eventValue: 'my-value'

      wbp.sendPayload payload

      ga_spy.should.have.been.calledOnce
      ga_spy.should.have.been.calledWith 'send', payload

      return

    return

  return
