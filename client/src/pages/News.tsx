import NewsItem from "../components/elements/NewsItem";
import { Col, Container, Row } from "react-bootstrap";
import { newsData } from "../data/newsData";

const News: React.FC = () => {
  return (
    <Container className="tw-text-center tw-mt-12">
      <Row className="justify-content-center">
        <Col xs={14} md={12} lg={10}>
          <h4 className="tw-mb-8 tw-font-bold tw-text-custom-color-blue">
            NEWS
          </h4>
          <hr className="tw-mb-4 tw-text-gray-900 tw-mx-auto tw-max-w-3xl" />
          <div className="tw-text-gray-700 tw-mx-auto tw-max-w-3xl tw-text-justify">
            <p></p>
            {newsData.map((news, index) => (
              <NewsItem key={index} date={news.date} text={news.text} />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default News;
