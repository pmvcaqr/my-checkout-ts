import { CheckoutService} from "./CheckoutService";
import { AmazonMembership, LargePizzaProduct, MediumPizzaProduct, MicrosoftMembership, NoneMembership, SmallPizzaProduct } from '../context/CartContext';

describe('Test the CheckoutService', () => {
  let mockItemCartSmall: ICartItem;
  let mockItemCartMedium: ICartItem
  let mockItemCartLarge: ICartItem;
  let mockInitialCartItems: ICartItem[];

  beforeEach(() => {
    mockItemCartSmall = {
      id: 1,
      name: 'Small Pizza Cart',
      description: '10 inch pizza for one person',
      productType: SmallPizzaProduct,
      products: [],
      subTotal: 0
    }

    mockItemCartMedium = {
      id: 1,
      name: 'Small Pizza Cart',
      description: '10 inch pizza for one person',
      productType: MediumPizzaProduct,
      products: [],
      subTotal: 0
    }

    mockItemCartLarge = {
      id: 1,
      name: 'Small Pizza Cart',
      description: '10 inch pizza for one person',
      productType: LargePizzaProduct,
      products: [],
      subTotal: 0
    }

    mockInitialCartItems = [mockItemCartSmall, mockItemCartMedium, mockItemCartLarge];
  });

  it('should increase the product in the cart item', () =>
  {
    let checkoutService = new CheckoutService();
    mockItemCartSmall.products.push(SmallPizzaProduct);
    let itemCart = checkoutService.addProduct(mockItemCartSmall);

    expect(itemCart.products.length).toEqual(mockItemCartSmall.products.length + 1);
  });

  it('should decrease the product in the cart item', () =>
  {
    let checkoutService = new CheckoutService();
    mockItemCartSmall.products.push(SmallPizzaProduct);
    let itemCart = checkoutService.removeProduct(mockItemCartSmall);

    expect(itemCart.products.length).toEqual(mockItemCartSmall.products.length - 1);
  });

  it('should calculate the cart with Default customer - $49.97', () =>
  {
    let checkoutService = new CheckoutService();

    mockItemCartSmall.products.push(SmallPizzaProduct);
    mockItemCartMedium.products.push(MediumPizzaProduct);
    mockItemCartLarge.products.push(LargePizzaProduct);

    checkoutService.setSelectedPrivilege(NoneMembership);


    let cartTotal = checkoutService.getTotal([mockItemCartSmall, mockItemCartMedium, mockItemCartLarge]);

    expect(cartTotal).toEqual(49.97);
  });
  it('should calculate the cart with Microsoft customer - $45.97', () =>
  {
    let checkoutService = new CheckoutService();

    mockItemCartSmall.products.push(SmallPizzaProduct);
    mockItemCartSmall.products.push(SmallPizzaProduct);
    mockItemCartSmall.products.push(SmallPizzaProduct);

    mockItemCartLarge.products.push(LargePizzaProduct);

    checkoutService.setSelectedPrivilege(MicrosoftMembership);

    let cartTotal = checkoutService.getTotal([mockItemCartSmall, mockItemCartMedium, mockItemCartLarge]);

    expect(cartTotal).toEqual(45.97);
  });

  it('should calculate the cart with Amazon customer - $67.96', () =>
  {
    let checkoutService = new CheckoutService();

    mockItemCartMedium.products.push(MediumPizzaProduct);
    mockItemCartMedium.products.push(MediumPizzaProduct);
    mockItemCartMedium.products.push(MediumPizzaProduct);
    mockItemCartLarge.products.push(LargePizzaProduct);

    checkoutService.setSelectedPrivilege(AmazonMembership);

    let cartTotal = checkoutService.getTotal([mockItemCartMedium, mockItemCartLarge]);

    expect(cartTotal).toEqual(67.96);
  });
})

