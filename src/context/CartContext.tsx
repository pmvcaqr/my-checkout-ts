import _ from 'lodash';
import * as React from 'react';
import { CheckoutService } from '../services/CheckoutService';
export const CartContext = React.createContext<CartContextType | null>(null);

export const SmallPizzaProduct: ProductType = {
  name: 'Small Pizza',
  description: '10 inch pizza for one person.',
  originalPrice: 11.99
}

export const MediumPizzaProduct: ProductType = {
  name: 'Medium Pizza',
  description: '12 inch pizza for one person.',
  originalPrice: 15.99
}

export const LargePizzaProduct: ProductType = {
  name: 'Large Pizza',
  description: '15 inch pizza for one person.',
  originalPrice: 21.99
}

export const Formula_Default: CalculateFormula = {
  id: 0,
  name: 'Default Formula',

  calculateSubtotal: (products: ProductType[]) => {
    const quantityOfBillableItems = products.length

    if (quantityOfBillableItems > 0) {
      const subTotal = products[0].originalPrice * quantityOfBillableItems;
      return subTotal;
    } else {
      return 0
    }
  }
}

export const Formula_BuyXGetY: CalculateFormula = {
  id: 1,
  name: 'Get extra products',

  calculateSubtotal: (products: ProductType[], x = 1, y = 0) => {
    const quantityPerPackage = x + y;
    const packages = _.chunk(products, quantityPerPackage);
    const originalPricePerProduct = products.length ? products[0].originalPrice : 0;

    const quantityOfFreeItems = packages.filter((packageItem) => {
      return packageItem.length > x
    }).length;

    const quantityOfBillableItems = products.length - quantityOfFreeItems;
    const subTotal = originalPricePerProduct * quantityOfBillableItems;

    return subTotal;
  }
}

export const Formula_ReduceYCashPerXItem: CalculateFormula = {
  id: 1,
  name: 'Get Cash discounts',

  calculateSubtotal: (products: ProductType[], x = 1, y = 0) => {
    const quantityPerPackage = x;
    const packages = _.chunk(products, quantityPerPackage);
    const originalPricePerProduct = products.length ? products[0].originalPrice : 0;

    const discountedCash = packages.length * y;
    const quantityOfBillableItems = products.length;

    const subTotal = originalPricePerProduct * quantityOfBillableItems - discountedCash;

    return subTotal;
  }
}

const DiscountOne: DiscountProgram = {
  id: 1,
  name: 'Buy 2 get 1 free',
  description: 'Buy 2 get 1 free',
  valueX: 2,
  valueY: 1,
  appliedFormular: Formula_BuyXGetY
}

const DiscountTwo: DiscountProgram = {
  id: 1,
  name: 'Discount 2$ per Pizza',
  description: 'Discount 2$ per Pizza',
  valueX: 1,
  valueY: 2,
  appliedFormular: Formula_ReduceYCashPerXItem
}

const DiscountThree: DiscountProgram = {
  id: 1,
  name: 'Buy 4 get 1 free',
  description: 'Buy 4 get 1 free',
  valueX: 4,
  valueY: 1,
  appliedFormular: Formula_BuyXGetY
}

export const NoneMembership: Membership = {
  id: 1,
  name: 'None',
  description: 'Default Membership',
}

export const MicrosoftMembership: Membership = {
  id: 2,
  name: 'Microsoft',
  description: 'Microsoft Membership',
  appliedProduct: SmallPizzaProduct,
  appliedDiscount: DiscountOne
}

export const AmazonMembership: Membership = {
  id: 3,
  name: 'Amazon',
  description: 'Amazon Membership',
  appliedProduct: LargePizzaProduct,
  appliedDiscount: DiscountTwo
}

export const FacebookMembership: Membership = {
  id: 4,
  name: 'Facebook',
  description: 'Facebook Membership',
  appliedProduct: MediumPizzaProduct,
  appliedDiscount: DiscountThree
}

export const initialCartItems: ICartItem[] = [
  {
    id: 1,
    name: 'Small Pizza Cart',
    description: '10 inch pizza for one person',
    productType: SmallPizzaProduct,
    products: [],
    subTotal: 0
  },
  {
    id: 2,
    name: 'Medium Pizza Cart',
    description: '12 inch pizza for two persons',
    productType: MediumPizzaProduct,
    products: [],
    subTotal: 0
  },
  {
    id: 3,
    name: 'Large Pizza Cart',
    description: '15 inch pizza for four persons',
    productType: LargePizzaProduct,
    products: [],
    subTotal: 0
  },
];

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = React.useState<ICartItem[]>(initialCartItems);

  const [cartMembership, setCartMembership] = React.useState<Membership>(NoneMembership);

  const checkoutService = new CheckoutService();

  React.useEffect(() => {
    onCartChanged();
  }, [cartMembership])

  const increaseProduct = (cartItem: ICartItem) => {
    cartItem.products = checkoutService.addProduct(cartItem).products;
    onCartChanged();
  }

  const decreaseProduct = (cartItem: ICartItem) => {
    cartItem.products = checkoutService.removeProduct(cartItem).products;
    onCartChanged();
  }

  const calculateTotal = () => {
    return checkoutService.getTotal(cartItems);
  }

  const onCartChanged = () => {
    checkoutService.setSelectedPrivilege(cartMembership);

    cartItems.forEach((item) => {
      item.subTotal = checkoutService.getSubtotal(item);
    })

    setCartItems([...cartItems]);
  }

  return (
    <CartContext.Provider value={{ cartItems, increaseProduct, decreaseProduct, calculateTotal, setCartMembership, cartMembership }}>
      {children}
    </CartContext.Provider>
  );

}

export default CartProvider;