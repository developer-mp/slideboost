import { useState, useEffect, useCallback } from "react";
import { handleErrorMessage } from "../common/handleActionMessage";
import { showErrorToast, showSuccessToast } from "../common/handleToast";
import { CheckoutResponse } from "../../interfaces/interfaces";
import { verifyPayment } from "../../store/actions/paymentAction";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";

const useCredits = (
  initialCredits: number,
  pricePerCredit: number,
  userId: string
) => {
  const [credits, setCredits] = useState<number>(10);
  const [amount, setAmount] = useState<number>(0);
  const [showCreditsModal, setShowCreditsModal] = useState<boolean>(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

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
    onCheckout: (amount: number, userId: string) => Promise<CheckoutResponse>
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
        error
      );
    }

    setShowCreditsModal(false);
  };

  const closeCreditsModal = () => {
    setShowCreditsModal(false);
    setCredits(initialCredits);
  };

  const verifyPaymentStatus = useCallback(
    async (sessionId: string) => {
      if (paymentVerified) return;

      try {
        const resultAction = await dispatch(
          verifyPayment({ sessionId })
        ).unwrap();

        if (resultAction.paid) {
          showSuccessToast("Payment Successful. Credits have been added");
          setPaymentVerified(true);
          setTimeout(() => {
            window.location.href = "/profile";
          }, 2000);
        } else {
          showErrorToast("Payment failed. Please try again");
          setPaymentVerified(true);
        }
      } catch (error) {
        const errorMessage = handleErrorMessage(error);
        showErrorToast(errorMessage);
        console.error(
          "Error occurred while verifying the payment status: ",
          error
        );
      }
    },
    [paymentVerified, dispatch]
  );

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (sessionId && !paymentVerified) {
      verifyPaymentStatus(sessionId);
    }
  }, [paymentVerified, verifyPaymentStatus]);

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
