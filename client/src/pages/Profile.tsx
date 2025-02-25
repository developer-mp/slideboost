import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getFirstChar } from "../utils/login/getFirstChar";
import { formatDate } from "./../utils/common/formatDate";
import { MdPersonOutline, MdOutlineCreditScore } from "react-icons/md";
import { createCheckout } from "../store/actions/paymentAction";
import { handleErrorMessage } from "../utils/common/handleActionMessage";
import { showErrorToast } from "../utils/common/handleToast";
import { config } from "../../env.config";
import CreditsModal from "../components/widgets/CreditsModal";

const Profile: React.FC = () => {
  const userName = useSelector((state: RootState) => state.user.userName);
  const createdAt = useSelector((state: RootState) => state.user.createdAt);
  const creditBalance = useSelector(
    (state: RootState) => state.user.creditBalance
  );
  const [showCreditsModal, setShowCreditsModal] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(10);
  const [amount, setAmount] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  const formattedCreatedAt = formatDate(createdAt, "MMM d, yyyy");

  const firstInitial = getFirstChar(userName);

  const handlePurchase = async () => {
    setShowCreditsModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const resultAction = await dispatch(
        createCheckout({
          amount,
        })
      ).unwrap();

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

  const updateAmount = useCallback(() => {
    const newAmount = Math.max(credits * Number(config.PRICE_PER_CREDIT), 0);
    setAmount(parseFloat(newAmount.toFixed(2)));
  }, [credits]);

  useEffect(() => {
    updateAmount();
  }, [updateAmount]);

  const closeCreditsModal = () => {
    setShowCreditsModal(false);
    setCredits(10);
  };

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
                    onConfirmPurchase={handleConfirmPurchase}
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
