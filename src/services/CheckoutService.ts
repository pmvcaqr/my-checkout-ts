import _, { cond } from 'lodash';
import { NoneMembership, SmallPizzaProduct, MediumPizzaProduct, LargePizzaProduct, Formula_Default } from "../context/CartContext";

export const SMALL_PIZZA_PRODUCT = "SMALL_PIZZA_PRODUCT";
export const MEDIUM_PIZZA_PRODUCT = "MEDIUM_PIZZA_PRODUCT";
export const LARGE_PIZZA_PRODUCT = "LARGE_PIZZA_PRODUCT";

export class CheckoutService {
  private selectedPrivilege: Membership;
  
  constructor() {
    this.selectedPrivilege = NoneMembership;
  }

  setSelectedPrivilege(privilege: Membership) {
    this.selectedPrivilege = privilege;
  }

  addProduct(cartItem: ICartItem): ICartItem {
    let updatedCartItem = cartItem;

    _.cond([
      [() => cartItem.productType == SmallPizzaProduct, () => updatedCartItem = {...cartItem, products: _.concat(cartItem.products, SmallPizzaProduct)}],
      [() => cartItem.productType == MediumPizzaProduct, () => updatedCartItem = {...cartItem, products: _.concat(cartItem.products, MediumPizzaProduct)}],
      [() => cartItem.productType == LargePizzaProduct, () => updatedCartItem = {...cartItem, products: _.concat(cartItem.products, LargePizzaProduct)}]
    ])();

    return updatedCartItem;
  }

  removeProduct(cartItem: ICartItem): ICartItem {
    let updatedCartItem = {...cartItem, products: _.drop(cartItem.products)};
    return updatedCartItem;
  }

  getSubtotal(cartItem: ICartItem): number {
    let subTotal = 0;

    // get applied discount program for the selected membership
    const appliedDiscountProgram = this.selectedPrivilege.appliedDiscount;

    // get the calculation formula for the selected discount program
    const appliedFormula = appliedDiscountProgram?.appliedFormular.calculateSubtotal ?? Formula_Default.calculateSubtotal;

    _.cond([
      [() => cartItem.productType == this.selectedPrivilege?.appliedProduct, () => subTotal = appliedFormula(cartItem.products, appliedDiscountProgram?.valueX, appliedDiscountProgram?.valueY)],
      [() => cartItem.productType != this.selectedPrivilege?.appliedProduct, () => subTotal = Formula_Default.calculateSubtotal(cartItem.products)]
    ])();

    return subTotal;
  }

  getTotal(cartItems: ICartItem[]): number {
    cartItems.forEach((item) => {
      item.subTotal = this.getSubtotal(item);
    })

    let total = cartItems.reduce((prev, current) => {
      return prev + current.subTotal;
    }, 0)

    return total;
  }
}