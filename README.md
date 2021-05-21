# BigCommerce Quick Shop Module

### Installation

```
npm i --save github:pixelunion/bc-quick-shop
```


### Usage

```
import $ from 'jquery';
import QuickShop from 'bc-quick-shop';

if ($('.quick-shop-trigger').length) {
  new QuickShop({
    el: $('.quick-shop-wrapper'),
    template: 'products/quick-shop'
  });
}
```

### Options

**template:** Template in which to render quick shop content.

**quickShop:** Selector for quick shop wrapper child (secondary wrapper).

**quickShopTrigger:** Selector for quick shop trigger.

**quickShopClose:** Optional. Selector for close button. Must be placed within the **quickShop** element.

**productOptions:** Selector for product options wrapper.

**bodyOverflowClass:** Class that toggles body overflow hidden (e.g., 'scroll-locked').

**onProductAdd:** Optional. Callback fired when add to cart button is clicked.

**afterProductAdd:** Optional. Callback fired after BC api responds to add to cart button being clicked.

**onOptionChange:** Optional. Callback fired when an option is changed.
