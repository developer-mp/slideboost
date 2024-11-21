import { NewsItemProps } from "../../interfaces/interfaces";

const NewsItem: React.FC<NewsItemProps> = ({ date, text }) => {
  return (
    <div>
      <h6 className="tw-mb-2 tw-font-bold tw-mx-auto tw-max-w-3xl tw-text-justify">
        {date}
      </h6>
      <p className="tw-mb-8">{text}</p>
    </div>
  );
};

export default NewsItem;
