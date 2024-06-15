import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faCubes,
  faIcons,
  faBarcode,
  faReply,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useForm, Controller } from "react-hook-form";
import localforage from "localforage";

import SaleBrands from "./SaleBrands";
import SaleCategories from "./SaleCategories";
import SaleDepartments from "./SaleDepartments";
import SaleFind from "./SaleFind";

import CloseSaleInline from "./CloseSaleInline";

import CartControls from "./cart.controls";
import CartContainer from "./cart.container";
import SearchVariants from "./SearchVariants";
import { SearchModes } from "./constants";
// import { getStore, getTerminal } from "./terminal/terminal.selector";
import { useLoadData } from "./hooks";
import { fetchJson, notify, scrollToBottom } from "./utils";
import { API_BASE_URL, BARCODE_LIST } from "./config";
import { useAtom } from "jotai";
import { terminalStateAtom,getTerminalAtom } from "../States/store";
import { getRealProductPrice } from "./Pos copy";

interface HomeProps {
  list: any[];
  paymentTypesList: any[];
}

interface Product {
  basePrice: number;
  taxes: any; // Replace with actual type
  brands: any[]; // Replace with actual type
  categories: any[]; // Replace with actual type
  department: any; // Replace with actual type
  variants: ProductVariant[];
  barcode?: string;
  name: string;
}

interface ProductVariant {
  barcode: string;
}

interface CartItem {
  quantity: number;
  item: Product;
  price: number;
  discount: number;
  taxes: any; // Replace with actual type
  taxIncluded: boolean;
  stock: number;
  variant?: ProductVariant;
}

interface Order {
  id: string;
  items: CartItem[];
  discount?: { type: string; amount: number };
  tax?: { type: string };
  customer?: any; // Replace with actual type
}

const PosMode = () => {
  const [terminal] = useAtom(getTerminalAtom);
  const [mode, setMode] = useState(SearchModes.sale);
  const [list, setList] = useState<HomeProps["list"]>({ list: [] });
  const [paymentTypesList, setPaymentTypesList] = useState<
    HomeProps["paymentTypesList"]
  >({ list: [] });
  const store = useSelector(getStore);
  // const terminal = useSelector(getTerminal);
  const [state] = useLoadData();
  const [appState, setAppState] = useAtom(defaultState);
  const [appSettings] = useAtom(defaultData);
  const { customerBox } = appSettings;
  const { q, added, rate, customerName } = appState;

  const searchField = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [modal, setModal] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [brands, setBrands] = useState<{ [key: string]: Brand }>({});
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});
  const [departments, setDepartments] = useState<{ [key: string]: Department }>(
    {}
  );

  const items = useMemo(() => {
    let filtered = list.list || [];

    if (store && filtered) {
      filtered = filtered.filter((item: { stores: any[]; }) => {
        if (item?.stores?.length > 0) {
          const stores = item.stores.map((storeItem: { store: { id: any; }; }) => storeItem.store.id);
          return stores.includes(store.id);
        } else {
          return true;
        }
      });
    }

    if (terminal && filtered) {
      filtered = filtered.filter((item: { terminals: any[]; }) => {
        if (item?.terminals?.length > 0) {
          const terminals = item.terminals.map(
            (terminalItem: { id: any; }) => terminalItem.id
          );
          return terminals.includes(terminal.id);
        } else {
          return true;
        }
      });
    }

    const brandIds = Object.keys(brands);
    if (brandIds.length > 0) {
      filtered = filtered.filter((item: { brands: any[]; }) => {
        if (item?.brands?.length > 0) {
          const brandsFilter = item.brands.filter((brand: { id: { toString: () => string; }; }) =>
            brandIds.includes(brand.id.toString())
          );
          return brandsFilter.length > 0;
        } else {
          return true;
        }
      });
    }

    const categoryIds = Object.keys(categories);
    if (categoryIds.length > 0) {
      filtered = filtered.filter((item: { categories: any[]; }) => {
        if (item?.categories?.length > 0) {
          const categoriesFilter = item.categories.filter((category: { id: { toString: () => string; }; }) =>
            categoryIds.includes(category.id.toString())
          );
          return categoriesFilter.length > 0;
        } else {
          return true;
        }
      });
    }

    const departmentIds = Object.keys(departments);
    if (departmentIds.length > 0) {
      filtered = filtered.filter((item: { department: { id: { toString: () => string; }; }; }) => {
        if (item?.department) {
          return departmentIds.includes(item.department.id.toString());
        } else {
          return false;
        }
      });
    }

    if (filtered) {
      filtered = filtered.filter((item: { barcode: string; name: string; }) => {
        if (
          item?.barcode &&
          item?.barcode.toLowerCase().startsWith(q.toLowerCase())
        ) {
          return true;
        }
        return item?.name?.toLowerCase().includes(q.toLowerCase());
      });
    }

    return filtered;
  }, [list.list, q, brands, categories, departments, terminal, store]);

  const itemsMap = useMemo(() => {
    const newItems = [...items];
    const map = new Map();
    newItems.forEach((item) => {
      map.set(item.barcode, { item, isVariant: false, variant: undefined });
      map.set(item.name, { item, isVariant: false, variant: undefined });

      if (item.variants.length > 0) {
        item.variants.forEach(() => {
          if (faBarcode) {
            map.set(faBarcode, { item, isVariant: true});
          }
        });
      }
    });

    return map;
  }, [items]);

  const { handleSubmit, control, reset } = useForm();

  const searchAction = async (values: any) => {
    const item = itemsMap.get(values.q);

    if (item === undefined) {
      try {
        const response = await fetchJson(
          `${API_BASE_URL}${BARCODE_LIST}?barcode=${values.q}`
        );
        if (response["hydra:member"].length > 0) {
          const barcodeItem: any = response["hydra:member"][0];
          if (barcodeItem.variant) {
            await addItemVariant(
              barcodeItem.item,
              barcodeItem.variant,
              Number(barcodeItem.measurement),
              Number(barcodeItem.price)
            );
          } else {
            await addItem(
              barcodeItem.item,
              Number(barcodeItem.measurement),
              Number(barcodeItem.price)
            );
          }
        } else {
          notify({
            type: "error",
            description: `${values.q} not found`,
            placement: "top",
            duration: 1,
          });
        }
      } catch (error) {
        console.error("Error fetching barcode item:", error);
        notify({
          type: "error",
          description: `Error fetching ${values.q}`,
          placement: "top",
          duration: 1,
        });
      }
    } else {
      if (!item.isVariant) {
        await addItem(item.item, Number(values.quantity));
      }
      if (item.isVariant) {
        await addItemVariant(item.item, item.variant, Number(values.quantity));
      }
    }

    reset({ q: "", quantity: 1 });
  };

  const addItem = async (item: Product, quantity: number, price?: number) => {
    let newPrice = item.basePrice || 0;
    if (price) {
      newPrice = price;
    }
    if (rate) {
      newPrice = rate;
    }

    const newItem: CartItem = {
      quantity,
      item,
      price: newPrice,
      discount: 0,
      taxes: item.taxes,
      taxIncluded: true,
      stock: 0,
    };

    const updatedItems = [...added, newItem];
    setAppState((prev: any) => ({ ...prev, added: updatedItems }));
    scrollToBottom(containerRef.current);
  };

  const addItemVariant = async (
    item: Product,
    variant: ProductVariant,
    quantity: number,
    price?: number
  ) => {
    const variantPrice = price || variant?.price || getRealProductPrice(item);

    const newItem: CartItem = {
      quantity,
      item,
      price: variantPrice,
      variant,
      discount: 0,
      taxes: item.taxes,
      taxIncluded: true,
      stock: 0,
    };

    const updatedItems = [...added, newItem];
    setAppState((prev: any) => ({ ...prev, added: updatedItems }));
    scrollToBottom(containerRef.current);
  };

  useEffect(() => {
    setList(state.list);
    setPaymentTypesList(state.paymentTypesList);
  }, [state.list, state.paymentTypesList]);

  useEffect(() => {
    if (added.length === 0) {
      setAppState((prev: any) => ({ ...prev, adjustment: 0 }));
    }
  }, [added]);

  useEffect(() => {
    localforage.getItem("defaultDiscount").then((data: any) => {
      setAppState((prev: any) => ({ ...prev, discount: data }));
    });
    localforage.getItem("defaultTax").then((data: any) => {
      setAppState((prev: any) => ({ ...prev, tax: data }));
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "F3" && searchField.current) {
        e.preventDefault();
        searchField.current.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const refundOrder = async (order: Order) => {
    const items: CartItem[] = order.items.map((item) => ({
      quantity: -1 * item.quantity,
      price: item.price,
      discount: 0,
      variant: item.variant,
      item: item.product,
      taxes: item.taxes,
      taxIncluded: true,
    }));

    setAppState((prev: any) => ({
      ...prev,
      added: items,
      discount: order.discount?.type,
      tax: order.tax?.type,
      discountAmount: order.discount?.amount,
      customer: order?.customer,
      refundingFrom: Number(order.id),
    }));
  };

  const reOrder = async (order: Order) => {
    const items: CartItem[] = order.items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      discount: 0,
      variant: item.variant,
      item: item.product,
      taxes: item.taxes,
      taxIncluded: true,
    }));

    setAppState((prev: any) => ({
      ...prev,
      added: items,
      discount: order.discount?.type,
      tax: order.tax?.type,
      discountAmount: order.discount?.amount,
      customer: order?.customer,
    }));
  };

  const setDefaultOptions = () => {
    localforage.getItem("defaultDiscount").then((data: any) => {
      setAppState((prev: any) => ({ ...prev, discount: data }));
    });
    localforage.getItem("defaultTax").then((data: any) => {
      setAppState((prev: any) => ({ ...prev, tax: data }));
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row gap-5 p-2 bg-white">
          <div className="gap-2 flex">
            <div className="input-group">
              <SaleBrands brands={brands} setBrands={setBrands}>
                <FontAwesomeIcon icon={faFlag} />
              </SaleBrands>
              <SaleCategories
                categories={categories}
                setCategories={setCategories}
              >
                <FontAwesomeIcon icon={faCubes} />
              </SaleCategories>
              <SaleDepartments
                departments={departments}
                setDepartments={setDepartments}
              >
                <FontAwesomeIcon icon={faIcons} />
              </SaleDepartments>
            </div>
          </div>
          <div className="flex flex-1 gap-3">
            <div className="input-group">
              <button
                className="btn-square"
                type="button"
                onClick={() => setMode(SearchModes.sale)}
              >
                <FontAwesomeIcon icon={faBarcode} />
              </button>
            </div>
            <div className="input-group">
              <SaleFind
                icon={faReply}
                title="Refund"
                variant="danger"
                onSuccess={refundOrder}
                onError={() => {
                  notify({
                    title: "Not found",
                    description: "Order not found",
                    type: "error",
                    placement: "top",
                  });
                }}
                displayLabel
              />
              <SaleFind
                icon={faRedoAlt}
                title="Re Order"
                variant="success"
                onSuccess={reOrder}
                onError={() => {
                  notify({
                    title: "Not found",
                    description: "Order not found",
                    type: "error",
                    placement: "top",
                  });
                }}
                displayLabel
              />
            </div>
            <form className="flex gap-3" onSubmit={handleSubmit(searchAction)}>
              <div className="input-group">
                <Controller
                  render={({ field }) => (
                    <input
                      placeholder="Scan barcode or search by name"
                      ref={searchField}
                      autoFocus
                      type="search"
                      className="search-field mousetrap lg w-72"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  name="q"
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                />
                <Controller
                  render={({ field }) => (
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="w-28 mousetrap lg"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  name="quantity"
                  control={control}
                  defaultValue={1}
                  rules={{ required: true }}
                />
              </div>
              <button className="hidden">submit</button>
            </form>
            {customerBox && (
              <input
                placeholder="Enter customer name"
                className="lg mousetrap"
                onChange={(event) => {
                  setAppState((prev: any) => ({
                    ...prev,
                    customerName: event.target.value,
                  }));
                }}
                value={customerName}
              />
            )}
          </div>
          <div className="mr-auto"></div>
        </div>
        <div className="grid grid-cols-4 gap-3 p-3">
          <div className="col-span-3">
            <CartControls containerRef={containerRef} />
            <div
              className="block overflow-auto h-[calc(100vh_-_230px)] bg-white"
              ref={containerRef}
            >
              <CartContainer />
            </div>
            <div className="flex gap-4 mt-3 items-center h-[50px]"></div>
          </div>
          <div className="col-span-1 bg-white p-3">
            <CloseSaleInline
              paymentTypesList={paymentTypesList.list}
              isInline={true}
            />
          </div>
        </div>
      </div>

      <SearchVariants
        modal={modal}
        onClose={() => {
          setModal(false);
          setVariants([]);
        }}
        variants={variants}
        addItemVariant={addItemVariant}
        items={items}
      />
    </>
  );
};

export default PosMode;
