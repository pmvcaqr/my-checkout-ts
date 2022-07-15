// type ProductType = {
//     name: string;
//     description: string;
//     originalPrice: number;
// }

type ProductType = "SMALL_PIZZA_PRODUCT" | "MEDIUM_PIZZA_PRODUCT" | "LARGE_PIZZA_PRODUCT";
type DiscountFormulaType = "DEFAULT_COMMON" | "BUY_X_GET_Y" | "REDUCE_Y_CASH_PER_X_PRODUCT";

type CalculateFormula = {
    id: number;
    name: string;

    calculateSubtotal: (products: ProductType[], x?: number, y?: number) => number;
}

type DiscountProgram = {
    id: number;
    name: string;
    description: string;

    valueX: number;
    valueY: number;

    // appliedFormular: CalculateFormula;
}

type IDiscountProgram = {
    id: number;
    name: string;
    description: string;
    factorX: number;
    factorY: number;
    appliedFormula?: DiscountFormulaType;
}

type Membership = {
    id: number;
    name: string;
    description: string;
    appliedProduct?: ProductType;
    appliedDiscount?: DiscountProgram;
}

interface IMembership {
    id: number;
    name: string;
    description: string;
    appliedProduct?: ProductType;
    appliedDiscount?: DiscountProgram;
}

interface ICartItem {
    id: number;
    productType: ProductType;
    products: ProductType[];
    name: string;
    description: string;

    subTotal: number;
}

interface ICartGroup {
    id: number;
    name: string;
    productItems: Product[];
    subTotal: () => number;

  increaseProductItem: () => void;
  decreaseProductItem: () => void;
  getQuantity: () => number;
}

interface CartProviderProps {
    children?: React.ReactNode;
}

type CartContextType = {
    cartItems: ICartItem[];
    cartGroups: ICartGroup[];

    // increaseProduct: (cartItem: ICartItem) => void;
    // decreaseProduct: (cartItem: ICartItem) => void;

    addToCart: (cartGroup: ICartGroup) => void;
    removeFromCart: (cartGroup: ICartGroup) => void;

    setCartMembership: (membership) => void;
    cartMembership: Membership;
    onCartChanged: () => void;
    calculateTotal: () => number;
}