import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({ show, onHide, totalAmount, onPrint }) {
  const okButtonRef = useRef(null);

  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onHide}
      >
        {/* ... */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <p className="mt-3 text-gray-900 sm:mt-0 sm:ml-4">
            Total Amount: {totalAmount.toLocaleString()} L.L
          </p>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={() => {
              onHide();
              onPrint();
            }}
          >
            Print
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onHide}
            ref={okButtonRef}
          >
            Ok
          </button>
        </div>
      </Dialog>
    </Transition>
  );
}
