import { useState, useEffect, useCallback } from "react";
import { handleErrorMessage } from "../common/handleActionMessage";
import { showErrorToast } from "../common/handleToast";
import { CheckoutResponse } from "../../interfaces/interfaces";

const useCredits = (initialCredits: number, pricePerCredit: number) => {
  const [credits, setCredits] = useState<number>(10);
  const [amount, setAmount] = useState<number>(0);
  const [showCreditsModal, setShowCreditsModal] = useState<boolean>(false);

  const updateAmount = useCallback(() => {
    const newAmount = Math.max(credits * pricePerCredit, 0);
    setAmount(parseFloat(newAmount.toFixed(2)));
  }, [credits, pricePerCredit]);

  useEffect(() => {
    updateAmount();
  }, [updateAmount]);

  const handlePurchase = () => {
    setShowCreditsModal(true);
  };

  const handleConfirmPurchase = async (
    onCheckout: (amount: number) => Promise<CheckoutResponse>
  ) => {
    try {
      const resultAction = await onCheckout(amount);
      const { url } = resultAction;

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while creating the checkout session: ",
        error
      );
    }

    setShowCreditsModal(false);
  };

  const closeCreditsModal = () => {
    setShowCreditsModal(false);
    setCredits(initialCredits);
  };

  return {
    credits,
    setCredits,
    amount,
    showCreditsModal,
    handlePurchase,
    handleConfirmPurchase,
    closeCreditsModal,
  };
};

export default useCredits;
