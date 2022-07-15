import _, { cond } from 'lodash';
import { NoneMembership } from "../context/CartContext";


export const SMALL_PIZZA_PRODUCT = "SMALL_PIZZA_PRODUCT";
export const MEDIUM_PIZZA_PRODUCT = "MEDIUM_PIZZA_PRODUCT";
export const LARGE_PIZZA_PRODUCT = "LARGE_PIZZA_PRODUCT";

const DISCOUNT_PROGRAM_NONE: IDiscountProgram = {
  id: 1,
  name: 'Default Discount Program',
  description: 'No discount',
  factorX: 0,
  factorY: 0,
  appliedFormula: 'DEFAULT_COMMON'
}

// const DISCOUNT_PROGRAM_ONE: DiscountProgram = {
//   id: 2,
//   name: 'Buy 2 get 1 free',
//   description: 'Buy 2 get 1 free',
//   valueX: 2,
//   valueY: 1
// }

// const DISCOUNT_PROGRAM_TWO: DiscountProgram = {
//   id: 3,
//   name: 'Discount 2$ per Pizza',
//   description: 'Discount 2$ per Pizza',
//   valueX: 1,
//   valueY: 2
// }

// const DISCOUNT_PROGRAM_THREE: DiscountProgram = {
//   id: 4,
//   name: 'Buy 4 get 1 free',
//   description: 'Buy 4 get 1 free',
//   valueX: 4,
//   valueY: 1
// }

class Product {
  private id: number;
  private name: string;
  private productType: ProductType;

  constructor(productType: ProductType, ) {
    this.id = Date.now();
    this.name = productType;
    this.productType = productType;
  }

  originalPrice() {
    const price = cond([
      [() => this.productType == SMALL_PIZZA_PRODUCT, () => 11.99],
      [() => this.productType === MEDIUM_PIZZA_PRODUCT, () => 12.99],
      [() => this.productType === LARGE_PIZZA_PRODUCT, () => 15.99],
    ])();

    return price ?? 0;
  }
}

class DiscountProgram {
    private id: number;
    private name: string;
    private description: string;

    private factorX: number = 0;
    private factorY: number = 0;

    appliedFormula?: DiscountFormulaType = "DEFAULT_COMMON";

    constructor(name: string, description: string) {
      this.id = Date.now();
      this.name = name;
      this.description = description;
    }

    setFactorX(valueX: number) {
      this.factorX = valueX;
    }

    setFactorY(valueY: number) {
      this.factorY = valueY;
    }

    getFactorX() {
      return this.factorX;
    }

    getFactorY() {
      return this.factorY;
    }

    setAppliedFormula(formula: DiscountFormulaType) {
      this.appliedFormula = formula;
    }
}

class Membership implements IMembership {
    id: number;
    name: string;
    description: string;
    appliedProduct?: ProductType;
    appliedDiscountProgram?: DiscountProgram;

    constructor(name: string, description: string ) {
      this.id = Date.now();
      this.name = name;
      this.description = description;
    }

    setAppliedProduct(productType: ProductType) {
      this.appliedProduct = productType;
    }

    setAppliedDiscountProgram(discountProgram: DiscountProgram) {
      this.appliedDiscountProgram = discountProgram;
    }
}

class CartGroup implements ICartGroup {
  id: number;
  name: string = '';
  private productType: ProductType;
  productItems: Product[] = [];
  private appliedDiscountProgram?: DiscountProgram;

  constructor(productType: ProductType) {
    this.id = Math.random();
    this.productType = productType;
    this.productItems = [];

    _.cond([
      [() => productType == 'SMALL_PIZZA_PRODUCT', () => this.name = 'Small Pizza cart'],
      [() => productType == 'MEDIUM_PIZZA_PRODUCT', () => this.name = 'Medium Pizza cart'],
      [() => productType == 'LARGE_PIZZA_PRODUCT', () => this.name = 'Large Pizza cart'],
    ])();
  }

  increaseProductItem() {
    // console.log('increaseProductItem');
    this.productItems.push(new Product(this.productType));
    console.log('increaseProductItem');
  }

  decreaseProductItem() {
    console.log('decreaseProductItem');
    this.productItems = _.drop(this.productItems, 1);
  }

  getQuantity() {
    return this.productItems.length;
  }

  subTotal() {
    const rs = cond([
      [() => !this.appliedDiscountProgram, () => this.formula_Default()],
      [() => this.appliedDiscountProgram?.appliedFormula == 'DEFAULT_COMMON', () => this.formula_Default()],
      [() => this.appliedDiscountProgram?.appliedFormula === 'BUY_X_GET_Y', () => this.formula_BuyXGetY(this.appliedDiscountProgram?.getFactorX() || 0, this.appliedDiscountProgram?.getFactorY() || 0)],
      [() => this.appliedDiscountProgram?.appliedFormula === 'REDUCE_Y_CASH_PER_X_PRODUCT', () => this.formula_ReduceYCashPerXProduct(this.appliedDiscountProgram?.getFactorX() || 0, this.appliedDiscountProgram?.getFactorY() || 0)],
    ])();

    return rs ?? 0;
  }

  private formula_Default(): number {
    const quantityOfBillableItems = this.productItems.length;
    const sellPrice = this.productItems[0]?.originalPrice() ?? 0;

    if (quantityOfBillableItems > 0) {
      const subTotal = sellPrice * quantityOfBillableItems;
      return subTotal;
    } else {
      return 0
    }
  }

  private formula_BuyXGetY(x: number, y: number) {
    const quantityPerPackage = x + y;
    const packages = _.chunk(this.productItems, quantityPerPackage);
    const sellPrice = this.productItems[0]?.originalPrice() ?? 0;

    const quantityOfFreeItems = packages.filter((packageItem) => {
      return packageItem.length > x
    }).length;

    const quantityOfBillableItems = this.productItems.length - quantityOfFreeItems;
    const subTotal = sellPrice * quantityOfBillableItems;

    return subTotal;
  }

  private formula_ReduceYCashPerXProduct(x: number, y: number) {
    return 0;
  }
}

export class CheckoutService {
  private cartItems?: ICartItem;
  private cart?: ICartItem[];
  private selectedPrivilege?: IMembership;
  private totalAmount: number = 0;
  private cartGroups: CartGroup[] = [];

  private availablePrivileges: IMembership[] = [];

  constructor() {
    this.selectedPrivilege = NoneMembership;
    this.totalAmount = 0;
  }

  init() {
    this.initPrivileges();
    this.initCartGroups();
  }

  private initPrivileges() {
    const microsoftMembership = new Membership('Microsoft', 'Microsoft Membership');
    const amazonMembership = new Membership('Amazon', 'Amazon Membership');
    const facebookMembership = new Membership('Facebook', 'Facebook Membership');

    this.availablePrivileges = [microsoftMembership, amazonMembership, facebookMembership];
  }

  private initCartGroups() {
    const smallPizzaCartGroup = new CartGroup(SMALL_PIZZA_PRODUCT);
    const mediumPizzaCartGroup = new CartGroup(MEDIUM_PIZZA_PRODUCT);
    const largePizzaCartGroup = new CartGroup(LARGE_PIZZA_PRODUCT);

    this.cartGroups = [smallPizzaCartGroup, mediumPizzaCartGroup, largePizzaCartGroup];
  }

  addToCart(cartGroup: ICartGroup) {
    // cartGroup.increaseProductItem();
    this.cartGroups[0].increaseProductItem();
    console.log('addToCart ', this.cartGroups);
    
    // switch(cartGroup) {
    //   case SMALL_PIZZA_PRODUCT:
    //     this.cartGroups[0].increaseProductItem();
    //     break;
    //    case MEDIUM_PIZZA_PRODUCT:
    //     this.cartGroups[1].increaseProductItem();
    //     break;
    //    case LARGE_PIZZA_PRODUCT:
    //     this.cartGroups[2].increaseProductItem();
    //     break;
    // }
  }

  removeFromCart(cartGroup: ICartGroup) {
    cartGroup.decreaseProductItem();
    console.log('removeFromCart');
    // switch(product) {
    //   case SMALL_PIZZA_PRODUCT:
    //     this.cartGroups[0].decreaseProductItem();
    //     break;
    //     case MEDIUM_PIZZA_PRODUCT:
    //     this.cartGroups[1].decreaseProductItem();
    //     break;
    //     case LARGE_PIZZA_PRODUCT:
    //     this.cartGroups[2].decreaseProductItem();
    //     break;
    // }
  }

  getCartItems() {
    console.log('getCartItems ', this.cartGroups);
    return this.cartGroups;
  }

  getAvailablePrivilege(): IMembership[] {
    return this.availablePrivileges;
  }

  setSelectedPrivilege(selectedPrivilege: IMembership) {
    this.selectedPrivilege = selectedPrivilege;
  }

  total() {   
    this.cartGroups.reduce((prev: number, item) => prev + item.subTotal(), 0);
  }
}