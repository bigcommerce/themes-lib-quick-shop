# BigCommerce Quick Shop Module

### Installation

```
jspm install --save bc-quick-shop=bitbucket:pixelunion/bc-quick-shop
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
