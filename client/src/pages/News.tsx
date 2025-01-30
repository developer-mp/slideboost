import { useDispatch, useSelector } from "react-redux";
import NewsItem from "../components/elements/NewsItem";
import { Col, Container, Row } from "react-bootstrap";
import { AppDispatch, RootState } from "../store/store";
import { handleErrorMessage } from "../utils/common/handleActionMessage";
import { showErrorToast } from "../utils/common/handleToast";
import { getNews } from "../store/actions/dataAction";
import { useEffect } from "react";

const News: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { news, isNewsFetched } = useSelector(
    (state: RootState) => state.dataStorage
  );

  const handleNews = async () => {
    try {
      await dispatch(getNews()).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while fetching the news: ", error);
    }
  };

  useEffect(() => {
    if (!isNewsFetched) {
      handleNews();
    }
  });

  return (
    <Container className="tw-text-center tw-mt-12 tw-mb-12">
      <Row className="justify-content-center">
        <Col xs={14} md={12} lg={10}>
          <h4 className="tw-mb-8 tw-font-bold tw-text-custom-color-blue">
            NEWS
          </h4>
          <hr className="tw-mb-4 tw-text-gray-900 tw-mx-auto tw-max-w-3xl" />
          <div className="tw-text-gray-700 tw-mx-auto tw-max-w-3xl tw-text-justify">
            <p></p>
            {news?.map((news, index) => (
              <NewsItem
                key={index}
                date={new Date(news.date).toISOString().split("T")[0]}
                text={news.text}
              />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default News;
