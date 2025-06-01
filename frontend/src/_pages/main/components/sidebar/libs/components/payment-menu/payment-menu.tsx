"use client";
import { Banknote, BanknoteArrowDown, CreditCard } from "lucide-react";
import { useState } from "react";
import { Dialog } from "~/libs/components/components";
import { PaymentMethod } from "./libs/components/components";
import ApplePayLogo from "~/../public/svg/apple-pay-logo.svg";

const PaymentMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<"apple-pay">("apple-pay");

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex gap-x-4 items-center"
      >
        <BanknoteArrowDown className="text-tertiary" />
        <span>Payment</span>
      </div>
      <Dialog
        className="z-[120] bg-gray-100"
        isOpen={isOpen}
        onCloseClick={() => setIsOpen((state) => !state)}
      >
        <div className="h-full w-full">
          <h2>Payment methods</h2>
          <div className="flex flex-col gap-y-2">
            <p className="mt-4 text-gray-600">Default order payment</p>
            <div className="w-full flex flex-col">
              <PaymentMethod
                label="Apple Pay"
                icon={
                  <ApplePayLogo className="text-tertiary w-[24px] h-[24px]" />
                }
                isSelected={selectedPaymentMethod === "apple-pay"}
                onClick={() => setSelectedPaymentMethod("apple-pay")}
              />
            </div>
          </div>
          <div className="w-full flex items-center bg-white p-4 gap-x-2 mt-2">
            <CreditCard className="text-tertiary" />
            <span>Add card</span>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export { PaymentMenu };
