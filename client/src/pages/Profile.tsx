import { useCallback, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getFirstChar } from "../utils/user/getFirstChar";
import { formatDate } from "./../utils/common/formatDate";
import { MdPersonOutline, MdOutlineCreditScore } from "react-icons/md";
import { createCheckout } from "../store/actions/paymentAction";
import { config } from "../../env.config";
import CreditsModal from "../components/widgets/CreditsModal";
import useCredits from "../utils/payment/useCredits";
import { getCreditBalance } from "../store/actions/userAction";
import { handleErrorMessage } from "../utils/common/handleActionMessage";
import { showErrorToast } from "../utils/common/handleToast";

const Profile: React.FC = () => {
  const { userName, userId, createdAt, creditBalance } = useSelector(
    (state: RootState) => state.user
  );

  const initialCredits = 10;
  const pricePerCredit = Number(config.PRICE_PER_CREDIT);

  const {
    credits,
    setCredits,
    amount,
    showCreditsModal,
    handlePurchase,
    handleConfirmPurchase,
    closeCreditsModal,
  } = useCredits(initialCredits, pricePerCredit, userId);
  const dispatch = useDispatch<AppDispatch>();

  const formattedCreatedAt = formatDate(createdAt, "MMM d, yyyy");

  const firstInitial = getFirstChar(userName);

  const onCheckout = async (amount: number, userId: string) => {
    return await dispatch(createCheckout({ amount, userId })).unwrap();
  };

  const handleConfirm = () => {
    handleConfirmPurchase(onCheckout);
  };

  const handleCreditBalance = useCallback(async () => {
    try {
      await dispatch(getCreditBalance({ userId })).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while retrieving the credit balance: ",
        error
      );
    }
  }, [dispatch, userId]);

  useEffect(() => {
    handleCreditBalance();
  }, [handleCreditBalance]);

  return (
    <Container className="tw-text-center tw-mt-12">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="tw-px-4">
          <Card className="tw-shadow-xl tw-rounded-lg tw-bg-white tw-p-6">
            <Card.Body>
              <h3 className="tw-text-xl tw-font-bold tw-mb-8 tw-text-custom-color-blue">
                Your Profile
              </h3>
              <div className="tw-w-28 tw-h-28 tw-rounded-full tw-bg-[#26A1B0] tw-flex tw-items-center tw-justify-center tw-text-white tw-text-5xl tw-font-bold tw-mx-auto tw-uppercase">
                {firstInitial}
              </div>
              <div className="tw-text-xl tw-font-semibold tw-text-gray-900 tw-text-center tw-mt-4">
                {userName}
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2 tw-text-gray-700 tw-text-base tw-text-center tw-mt-3">
                <MdPersonOutline className="tw-text-2xl" />
                <div>Joined on {formattedCreatedAt}</div>
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2 tw-text-gray-700 tw-text-base tw-text-center tw-mt-3">
                <MdOutlineCreditScore className="tw-text-2xl" />
                <div>Credits: {creditBalance}</div>
                <span>
                  <Button
                    className="button button-primary-auto tw-ml-2"
                    onClick={handlePurchase}
                  >
                    Buy credits
                  </Button>
                  <CreditsModal
                    showModal={showCreditsModal}
                    closeModal={closeCreditsModal}
                    onConfirmPurchase={handleConfirm}
                    credits={credits}
                    setCredits={setCredits}
                    amount={amount}
                  />
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
