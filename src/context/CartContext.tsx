import _ from 'lodash';
import * as React from 'react';
import { CheckoutService } from '../services/CheckoutService';
export const CartContext = React.createContext<CartContextType | null>(null);

const SmallPizzaProduct = {
  name: 'Small Pizza',
  description: '10 inch pizza for one person.',
  originalPrice: 11.99
}

const MediumPizzaProduct = {
  name: 'Medium Pizza',
  description: '12 inch pizza for one person.',
  originalPrice: 15.99
}

const LargePizzaProduct = {
  name: 'Large Pizza',
  description: '15 inch pizza for one person.',
  originalPrice: 21.99
}

const Formula_Default: CalculateFormula = {
  id: 0,
  name: 'Default Formula',

  calculateSubtotal: (products: ProductType[]) => {
    const quantityOfBillableItems = products.length

    return 0
  }
}

const Formula_BuyXGetY: CalculateFormula = {
  id: 1,
  name: 'Get extra products',

  calculateSubtotal: (products: ProductType[], x = 1, y = 0) => {
    const quantityPerPackage = x + y;
    const packages = _.chunk(products, quantityPerPackage);
   
    return 0;
  }
}

const Formula_ReduceYCashPerXItem: CalculateFormula = {
  id: 1,
  name: 'Get Cash discounts',

  calculateSubtotal: (products: ProductType[], x = 1, y = 0) => {
    return 0;
  }
}

// const DiscountOne: DiscountProgram = {
//   id: 1,
//   name: 'Buy 2 get 1 free',
//   description: 'Buy 2 get 1 free',
//   valueX: 2,
//   valueY: 1,
//   appliedFormular: Formula_BuyXGetY
// }

// const DiscountTwo: DiscountProgram = {
//   id: 1,
//   name: 'Discount 2$ per Pizza',
//   description: 'Discount 2$ per Pizza',
//   valueX: 1,
//   valueY: 2,
//   appliedFormular: Formula_ReduceYCashPerXItem
// }

// const DiscountThree: DiscountProgram = {
//   id: 1,
//   name: 'Buy 4 get 1 free',
//   description: 'Buy 4 get 1 free',
//   valueX: 4,
//   valueY: 1,
//   appliedFormular: Formula_BuyXGetY
// }

export const NoneMembership: Membership = {
  id: 1,
  name: 'None',
  description: 'Default Membership'
}

export const MicrosoftMembership: Membership = {
  id: 2,
  name: 'Microsoft',
  description: 'Microsoft Membership',
}

export const AmazonMembership: Membership = {
  id: 3,
  name: 'Amazon',
  description: 'Amazon Membership'
}

export const FacebookMembership: Membership = {
  id: 4,
  name: 'Facebook',
  description: 'Facebook Membership',
  // appliedProduct: MediumPizzaProduct,
  // appliedDiscount: DiscountThree
}

const initialCartItems: ICartItem[] = [
  {
    id: 1,
    name: 'Small Pizza Cart',
    description: '10 inch pizza for one person',
    productType: 'SMALL_PIZZA_PRODUCT',
    products: [],
    subTotal: 0
  },
  {
    id: 2,
    name: 'Medium Pizza Cart',
    description: '12 inch pizza for two persons',
    productType: 'SMALL_PIZZA_PRODUCT',
    products: [],
    subTotal: 0
  },
  {
    id: 3,
    name: 'Large Pizza Cart',
    description: '15 inch pizza for four persons',
    productType: 'SMALL_PIZZA_PRODUCT',
    products: [],
    subTotal: 0
  },
];

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = React.useState<ICartItem[]>(initialCartItems);
  const [cartGroups, setCartGroups] = React.useState<ICartGroup[]>([]);
  const [cartMembership, setCartMembership] = React.useState<Membership>(NoneMembership);
  
  const checkoutService = new CheckoutService();
 
  React.useEffect(() => {
    checkoutService.init();
    setCartGroups(checkoutService.getCartItems());
  }, [])

  React.useEffect(() => {
    onCartChanged();
  }, [cartMembership])

  const increaseProduct = (cartItem: ICartItem) => {
    // switch (cartItem.id) {
    //   case 1:
    //     cartItem.products.push(SmallPizzaProduct);
    //     break;
    //   case 2:
    //     cartItem.products.push(MediumPizzaProduct);
    //     break;
    //   case 3:
    //     cartItem.products.push(LargePizzaProduct);
    //     break;
    //   default:
    //     break;
    // }
    // onCartChanged();
  }

  const decreaseProduct = (cartItem: ICartItem) => {
    // cartItem.products = _.drop(cartItem.products);
    // onCartChanged();
  }

  const addToCart = (cartGroup: ICartGroup) => {
    checkoutService.addToCart(cartGroup);
    setCartGroups([...checkoutService.getCartItems()]);
  }

  const removeFromCart = (cartGroup: ICartGroup) => {
    checkoutService.removeFromCart(cartGroup);
    setCartGroups([...checkoutService.getCartItems()]);
  }

  const calculateTotal = () => {
    return cartItems.reduce((ack: number, item) => ack + item.subTotal, 0);
  }

  const onCartChanged = () => {
    // // get applied membership if exists
    // const appliedMembership = cartMembership;
    // // get applied discount program for the selected membership
    // const appliedDiscountProgram = cartMembership.appliedDiscount;
    // // get the calculation formula for the selected discount program
    // const appliedFormula = appliedMembership.appliedDiscount?.appliedFormular.calculateSubtotal ?? Formula_Default.calculateSubtotal

    // // calculate subtotal for each cart row
    // cartItems.forEach((cartItem) => {
    //   if (cartItem.productType == appliedMembership.appliedProduct) {
    //     cartItem.subTotal = appliedFormula(cartItem.products, appliedDiscountProgram?.valueX, appliedDiscountProgram?.valueY);
    //   } else {
    //     cartItem.subTotal = appliedFormula(cartItem.products);
    //   }
    // })
    setCartGroups([...checkoutService.getCartItems()]);
    // setCartItems([...cartItems]);
  }

  const getAppliedMembership = () => {
    return cartMembership;
  }

  const getAppliedDiscountProgram = (cartMembership: Membership) => {
    return cartMembership.appliedDiscount;
  }

  const getFormula = (discountProgram: DiscountProgram) => {
    // return discountProgram?.appliedFormular ?? Formula_Default.calculateSubtotal;
  }

  return (
    <CartContext.Provider value={{ cartItems, cartGroups, addToCart, removeFromCart, calculateTotal, setCartMembership, cartMembership, onCartChanged }}>
      {children}
    </CartContext.Provider>
  );

}

export default CartProvider;