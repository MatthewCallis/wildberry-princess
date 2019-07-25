const test = require('ava');
const sinon = require('sinon');
const WildberryPrincess = require('./../src/wildberry-princess');

const transaction_id = `${Date.now()}`;
const transaction = {
  id: transaction_id,
  affiliation: 'Candy Kingdom',
  revenue: 123,
  shipping: '0',
  tax: '0',
};
const item = {
  id: transaction_id,
  name: 'b',
  category: 'a',
  price: 123,
  quantity: 1,
};

test('#trackEcommerce: should send the payload when there is GA', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();

  t.is(ga_spy.callCount, 0);
  wbp.trackEcommerce('clear');
  t.true(ga_spy.calledWith('ecommerce:clear'));
  wbp.trackEcommerce('addTransaction', transaction);
  t.true(ga_spy.calledWith('ecommerce:addTransaction', transaction));
  wbp.trackEcommerce('addItem', item);
  t.true(ga_spy.calledWith('ecommerce:addItem', item));
  wbp.trackEcommerce('send');
  t.true(ga_spy.calledWith('ecommerce:send'));
});

test('#trackEcommerce: should not send the payload when there is no GA', (t) => {
  window.ga = () => {};
  const ga_spy = sinon.spy(window, 'ga');
  const wbp = new WildberryPrincess();

  window.ga = null;
  t.is(ga_spy.callCount, 0);
  wbp.trackEcommerce('clear');
  t.is(ga_spy.callCount, 0);
  wbp.trackEcommerce('addTransaction', transaction);
  t.is(ga_spy.callCount, 0);
  wbp.trackEcommerce('addItem', item);
  t.is(ga_spy.callCount, 0);
  wbp.trackEcommerce('send');
  t.is(ga_spy.callCount, 0);
});
