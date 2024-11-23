import { Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getFirstChar } from "../utils/login/getFirstChar";
import { formatDate } from "./../utils/common/formatDate";
import { MdPersonOutline, MdOutlineSubscriptions } from "react-icons/md";

const Profile: React.FC = () => {
  const userName = useSelector((state: RootState) => state.user.userName);
  const createdAt = useSelector((state: RootState) => state.user.createdAt);
  const plan = useSelector((state: RootState) => state.user.plan);
  const formattedCreatedAt = formatDate(createdAt, "MMM d, yyyy");

  const firstInitial = getFirstChar(userName);
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
                <div>Joined in {formattedCreatedAt}</div>
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2 tw-text-gray-700 tw-text-base tw-text-center tw-mt-3">
                <MdOutlineSubscriptions className="tw-text-2xl" />
                <div>Subscription plan: {plan}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
