import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import trend from 'jquery-trend';
import utils from 'bigcommerce/stencil-utils';
import SelectWrapper from '../global/select-wrapper';

export default class QuickShop {
  constructor(options) {
    this.$el = $(options.el);

    this.options = $.extend({
      template: 'products/quick-shop',
      quickShop: '.quick-shop',
      quickShopTrigger: '.quick-shop-trigger'
    }, options);

    this.$quickShop = this.$el.children(this.options.quickShop);

    this._bindEvents();
  }

  _bindEvents() {
    $('body').on('click', this.options.quickShopTrigger, (event) => {
      this._initializeQuickShop(event);
    });

    this.$el.on('click', (event) => {
      this._closeQuickShop(event);
    });
  }

  _initializeQuickShop(event) {
    this.productId = $(event.target).data('product-id');

    $(document.body).css('overflow','hidden');
    this.$el.addClass('visible');

    utils.api.product.getById(this.productId, { template: this.options.template }, (err, response) => {
      this.$quickShop.html(response);

      for (let i of this.$el.find('select').length) {
        new SelectWrapper(this.$el.find('select').eq(i));
      }

      // The knockout.js view model
      this.viewModel = {
        quantity: ko.observable(1),
        price: ko.observable(),
        sku: ko.observable(),
        instock: ko.observable(true),
        purchasable: ko.observable(true),
        canAddToCart: ko.pureComputed(() => {
          return this.viewModel.instock() && this.viewModel.purchasable();
        })
      };

      ko.applyBindings(this.viewModel, this.$quickShop.find('[data-cart-item-add]').get(0));
      this._productOptions();
      this._addProductToCart();
      this._positionQuickShop();
    });
  }

  _closeQuickShop(event) {
    if (!$(event.target).closest(this.options.quickShop).length) {
      this.$el.removeClass('visible').one('trend', () => {
        $(document.body).css('overflow','visible');
        this.$el.add(this.$quickShop).removeClass('active');
      });
    }
  }

  _positionQuickShop() {
    this.$quickShop.imagesLoaded(() => {
      this.$quickShop.css({
        marginTop: -(this.$quickShop.outerHeight() / 2),
        marginLeft: -(this.$quickShop.outerWidth() / 2)
      });
      this.$quickShop.addClass('active');
    });
  }

  _productOptions() {
    this.$el.find('.product-options').on('change', (event) => {
      let $target = $(event.target);
      let $ele = $(event.currentTarget);
      let targetVal = $target.val();
      let options = {};

      if (targetVal) {
        options = this._getOptionValues($ele);

        // check inventory when the option has changed
        utils.api.productAttributes.optionChange(options, this.productId, (err, response) => {
          this.viewModel.price(response.data.price);
          this.viewModel.sku(response.data.sku);
          this.viewModel.instock(response.data.instock);
          this.viewModel.purchasable(response.data.purchasable);
        });
      }
    });
  }

  _addProductToCart() {
    utils.hooks.on('cart-item-add', (event) => {
      event.preventDefault();

      const $button = this.$quickShop.find('.add-to-cart');
      const $productMessage = this.$quickShop.find('.product-message');
      let quantity = this.$quickShop.find('.product-quantity[name=qty\\[\\]]').val();
      let $optionsContainer = this.$quickShop.find('.product-options');
      let options;

      $button.find(".spinner").addClass("visible");

      options = this._getOptionValues($optionsContainer);

      // add item to cart
      utils.api.cart.itemAdd(this.productId, quantity, options, (err, response) => {
        let message = '';

        // if there is an error
        if (err || response.data.error) {
          if (response.data.error === 'out_of_stock') {
            message = Theme.localization.product.outOfStock;
            message = message.replace('*quantity*', quantity);
          } else {
            message = response.data.error;
          }

          setTimeout(() => {
            $productMessage.html(message).addClass('form-error-message');
            $button.find('.spinner').removeClass('visible');
          });
        }

        else {
          message = Theme.localization.product.addSuccess;
          message = message
                      .replace('*product*', this.$quickShop.find('.product-details').data('product-title'))
                      .replace('*cart_link*', `<a href='${Theme.localization.urls.cart}'>${Theme.localization.product.cartLink}</a>`)
                      .replace('*continue_link*', `<a href='/'>${Theme.localization.product.homeLink}</a>`)
                      .replace('*checkout_link*', `<a href='${Theme.localization.urls.checkout}'>${Theme.localization.product.checkoutLink}</a>`);

          setTimeout(() => {
              $productMessage.html(message).removeClass('form-error-message');
              $button.find('.spinner').removeClass('visible');
          }, 500);
        }
      });
    });
  }

  _getOptionValues($container) {
    let $optionValues = $container.find(':input:radio:checked, :input:not(:radio)');
    let params = {};

    // iterate over values
    $optionValues.each((index, ele) => {
      let $ele = $(ele);
      let name = $ele.attr('name');
      let val = $ele.val();

      params[name] = val;
    });

    return params;
  }
}
