import { useState, useEffect, useCallback, useRef } from "react";
import { handleErrorMessage } from "../common/handleActionMessage";
import { showErrorToast, showSuccessToast } from "../common/handleToast";
import { CheckoutResponse } from "../../interfaces/interfaces";
import { useVerifyPaymentMutation } from "../../store/api/appApi";

const useCredits = (
  initialCredits: number,
  pricePerCredit: number,
  userId: string,
) => {
  const [credits, setCredits] = useState<number>(10);
  const [amount, setAmount] = useState<number>(0);
  const [showCreditsModal, setShowCreditsModal] = useState<boolean>(false);
  const paymentVerifiedRef = useRef<boolean>(false);
  const [verifyPayment] = useVerifyPaymentMutation();

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
    onCheckout: (amount: number, userId: string) => Promise<CheckoutResponse>,
  ) => {
    try {
      const resultAction = await onCheckout(amount, userId);
      const { url } = resultAction;

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while creating the checkout session: ",
        error,
      );
    }

    setShowCreditsModal(false);
  };

  const closeCreditsModal = () => {
    setShowCreditsModal(false);
    setCredits(initialCredits);
  };

  const verifyPaymentStatus = useCallback(
    async (sessionId: string, credits: number, userId: string) => {
      if (paymentVerifiedRef.current) return;
      paymentVerifiedRef.current = true;

      try {
        const resultAction = await verifyPayment({
          sessionId,
          credits,
          userId,
        }).unwrap();

        if (resultAction.paid === true) {
          showSuccessToast("Payment Successful. Credits have been added");
          setTimeout(() => {
            window.location.href = "/profile";
          }, 3000);
        } else {
          showErrorToast("Payment failed. Please try again");
        }
      } catch (error) {
        const errorMessage = handleErrorMessage(error);
        showErrorToast(errorMessage);
        console.error(
          "Error occurred while verifying the payment status: ",
          error,
        );
      }
    },
    [verifyPayment],
  );

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );

    if (sessionId && !paymentVerifiedRef.current) {
      verifyPaymentStatus(sessionId, credits, userId);
    }
  }, [credits, userId, verifyPaymentStatus]);

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
