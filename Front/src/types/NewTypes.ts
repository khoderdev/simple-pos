import { CartItem } from "./AllTypes";

export interface HydraCollection<T = any> extends HydraId, HydraType {
  "@context": string;
  "hydra:totalItems": number;
  "hydra:member": T[];
  "hydra:view": {
    "@id": string;
    "@type": string;
  };
}

export interface HydraError extends HydraType {
  "@context": string;
  "hydra:description": string;
  "hydra:title": string;
  trace: HydraErrorTrace[];
}

export interface HydraErrorTrace {
  args: string[];
  class: string;
  file: string;
  line: number;
  namespace: string;
  short_class: string;
  type: string;
}

export interface HydraId {
  "@id"?: string;
}

export interface HydraType {
  "@type"?: string;
}

export interface ProductPrice extends HydraId, HydraType {
  id: number;
  date?: string;
  time?: string;
  timeTo?: string;
  day?: string;
  week?: number;
  month?: number;
  quarter?: number;
  rate?: number;
  minQuantity?: number;
  maxQuantity?: number;
  basePrice?: number;
  baseQuantity?: number;
}

export interface ProductVariant extends HydraId, HydraType {
  id: number;
  name?: string;
  attributeName?: string;
  attributeValue?: string;
  barcode?: string;
  price?: number;
  prices?: ProductPrice[];
  quantity?: number;
}

export interface Category extends HydraId, HydraType {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
  stores: Store[];
}

export interface Brand extends HydraId, HydraType {
  id: string;
  name: string;
  stores: Store[];
  isActive: boolean;
}

export interface User extends HydraId, HydraType {
  username: string;
  displayName: string;
  id: number;
  email: string;
  roles: string[];
  stores: Store[];
  isActive: boolean;
}

export interface PurchaseItem extends HydraId, HydraType {
  id: number;
  item: Product;
  quantity: string;
  quantityRequested?: string;
  purchasePrice: string;
  purchaseUnit?: string;
  barcode?: string;
  comments?: string;
  variants: PurchaseItemVariant[];
  createdAt: string;
  purchase: Pick<Purchase, "@id" | "createdAt">;
}

export interface PurchaseItemVariant extends HydraId, HydraType {
  id: number;
  variant: ProductVariant;
  quantity: string;
  quantityRequested?: string;
  purchasePrice: string;
  purchaseUnit?: string;
  barcode?: string;
  comments?: string;
}

export interface PaymentType extends HydraId, HydraType {
  id: string;
  name: string;
  type: string;
  canHaveChangeDue?: boolean;
  stores: Store[];
  isActive: boolean;
}

export interface Purchase extends HydraId, HydraType {
  id: number;
  createdAt: string;
  supplier?: Supplier;
  store: Store;
  items: PurchaseItem[];
  updateStocks?: boolean;
  updatePrice?: boolean;
  purchasedBy?: User;
  purchaseOrder?: PurchaseOrder;
  purchaseNumber?: number;
  purchaseMode?: string;
  paymentType?: PaymentType;
  total: number;
}

export interface PurchaseOrderItem extends HydraId, HydraType {
  id: number;
  item: Product;
  quantity: string;
  price: string;
  unit?: string;
  comments?: string;
  variants: PurchaseOrderItemVariant[];
}

export interface PurchaseOrderItemVariant extends HydraId, HydraType {
  id: number;
  quantity: string;
  variant: ProductVariant;
  purchasePrice: string;
  purchaseUnit?: string;
  comments?: string;
}

export interface PurchaseOrder extends HydraId, HydraType {
  id: number;
  createdAt: string;
  supplier?: Supplier;
  items: PurchaseOrderItem[];
  store?: Store;
  poNumber?: string;
  isUsed?: boolean;
}

export interface SupplierPayment extends HydraId, HydraType {
  id: string;
  amount: number;
  description?: string;
  createdAt: string;
  purchase?: Omit<Purchase, "supplier">;
}

export interface Supplier extends HydraId, HydraType {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  fax?: string;
  whatsApp?: string;
  address?: string;
  stores: Store[];
  openingBalance?: number;
  payments: SupplierPayment[];
  purchases: Purchase[];
  purchaseOrder: PurchaseOrder[];
  outstanding: number;
  purchaseTotal: number;
  paid: number;
}

export interface ProductStore extends HydraId, HydraType {
  id: number;
  store: Store;
  product: Product;
  quantity: string;
  location?: string;
  reOrderLevel?: string;
}

export interface Tax extends HydraId, HydraType {
  id: number;
  name: string;
  rate: number;
  stores: Store[];
  isActive: boolean;
}

export interface Department extends HydraId, HydraType {
  id: string;
  name: string;
  description?: string;
  uuid: string;
  createdAt: { datetime: string };
  updatedAt: { datetime: string };
  store?: Store;
}

export interface Product extends HydraId, HydraType {
  id: number;
  name: string;
  sku?: string;
  barcode?: string;
  baseQuantity?: number;
  isAvailable?: boolean;
  quantity?: number;
  basePrice: number;
  categories: Category[];
  variants: ProductVariant[];
  prices: ProductPrice[];
  isActive: boolean;
  uuid?: string;
  purchaseUnit?: string;
  saleUnit?: string;
  cost?: number;
  brands: Brand[];
  suppliers: Supplier[];
  stores: ProductStore[];
  department?: Department;
  terminals: Terminal[];
  taxes: Tax[];
  manageInventory?: boolean;
}

export interface SearchableProduct {
  isVariant?: boolean;
  variant?: ProductVariant;
  item: Product;
}

export interface Terminal extends HydraId, HydraType {
  id: string;
  code: string;
  store?: Store;
  description?: string;
  uuid: string;
  createdAt: { datetime: string };
  updatedAt: { datetime: string };
  products: Product[];
  isActive: boolean;
}

export interface Store extends HydraId, HydraType {
  id: string;
  name: string;
  location?: string;
  terminals: Terminal[];
  isActive: boolean;
}

export interface Discount extends HydraId, HydraType {
  id: number;
  name: string;
  rate?: number;
  rateType?: string;
  scope?: string;
  stores: Store[];
  isActive: boolean;
}


export interface OrderItem extends HydraId, HydraType {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  isSuspended?: boolean;
  isDeleted?: boolean;
  isReturned?: boolean;
  taxes: Tax[];
  taxesTotal: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tax extends HydraId, HydraType {
  id: number;
  name: string;
  rate: number;
  stores: Store[];
  isActive: boolean;
}



export interface OrderTax extends HydraId, HydraType {
  id: string;
  rate?: number;
  amount?: number;
  type?: Tax;
}


export interface Discount extends HydraId, HydraType {
  id: number;
  name: string;
  rate?: number;
  rateType?: string;
  scope?: string;
  stores: Store[];
  isActive: boolean;
}

export enum DiscountRate {
  RATE_FIXED = "fixed",
  RATE_PERCENT = "percent",
}

export enum DiscountScope {
  SCOPE_OPEN = "open",
  SCOPE_EXACT = "exact",
}

export interface OrderDiscount extends HydraId, HydraType {
  id: string;
  rate?: number;
  amount?: number;
  type?: Discount;
}

export interface OrderItemSimple extends HydraId, HydraType {
  id: string;
  product?: string;
  variant?: string;
  quantity: number;
  price: number;
  isSuspended?: boolean;
  isDeleted?: boolean;
  isReturned?: boolean;
  taxes: string[];
  taxesTotal: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  order?: string;
}

export interface OrderPayment extends HydraId, HydraType {
  total: number;
  received: number;
  due: number;
  type?: PaymentType;
}


export interface Order extends HydraId, HydraType {
  id: string;
  orderId?: string;
  customer?: Customer;
  isSuspended?: boolean;
  isDeleted?: boolean;
  isReturned?: boolean;
  isDispatched?: boolean;
  user?: User;
  items: OrderItem[];
  discount?: OrderDiscount;
  tax?: OrderTax;
  payments: OrderPayment[];
  createdAt: string;
  status: string;
  returnedFrom?: Pick<Order, "id" | "orderId" | "createdAt">;
  notes?: string;
  store: Store;
  terminal: Terminal;
  itemTaxes: number;
  adjustment?: number;
}

export enum OrderStatus {
  COMPLETED = "Completed",
  ON_HOLD = "On Hold",
  DELETED = "Deleted",
  DISPATCHED = "Dispatched",
  PENDING = "Pending",
  RETURNED = "Returned",
}

export enum PosModes {
  pos = "pos",
  order = "order",
  payment = "payment",
}

export interface Coupon extends HydraId, HydraType {
  id: string;
}

export interface CustomerPayment extends HydraId, HydraType {
  id: string;
  amount: number;
  description: string;
  order?: Omit<Order, "customer" | "payments">;
  createdAt: string;
}

export interface Customer extends HydraId, HydraType {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  lat?: number;
  lng?: number;
  sale?: number;
  paid?: number;
  outstanding: number;
  cnic?: string;
  payments: CustomerPayment[];
  orders: Omit<Order, "customer">[];
  openingBalance?: number;
  allowCreditSale?: boolean;
  creditLimit?: string;
}

export interface DefaultStateInterface {
  q: string;
  added: CartItem[];
  selected: number;
  selectedVariant: number;
  latest?: Product;
  latestVariant?: ProductVariant;
  latestIndex?: number;
  latestQuantity?: number;
  latestRate?: number;
  quantity: number;
  rate: number;
  discount?: Discount;
  discountAmount?: number;
  discountRateType?: string;
  tax?: Tax;
  coupon?: Coupon;
  customer?: Customer;
  refundingFrom?: number;
  adjustment: number;
  cartItem?: number;
  cartItemType: string;
  orderId?: string;
  customerName?: string;
  paymentType?: PaymentType;
}

export interface DefaultDataInterface {
  defaultTax?: Tax;
  defaultDiscount?: Discount;
  defaultPaymentType?: PaymentType;
  enableShortcuts?: boolean;
  displayShortcuts?: boolean;
  enableTouch?: boolean;
  defaultMode?: PosModes;
  searchBox?: boolean;
  customerBox?: boolean;
  requireCustomerBox?: boolean;
}
