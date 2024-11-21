import { Col, Row } from "react-bootstrap";
import { TemplateProps } from "../../interfaces/interfaces";

interface TemplatesDisplayProps {
  templates: TemplateProps[];
  selectedTemplate?: TemplateProps | null;
  onSelect?: (template: TemplateProps | null) => void;
  showTemplateDetails?: boolean;
}

const TemplatesDisplay: React.FC<TemplatesDisplayProps> = ({
  templates,
  selectedTemplate,
  onSelect,
  showTemplateDetails = true,
}) => {
  const handleTemplateClick = (template: TemplateProps) => {
    if (onSelect) {
      const newSelectedTemplate =
        selectedTemplate?.id === template.id ? null : template;
      onSelect(newSelectedTemplate);
    }
  };

  return (
    <Row>
      {templates.map((template, index) => {
        const isSelected = selectedTemplate?.id === template.id;

        return (
          <Col xs={12} md={4} key={index} className="tw-mb-6">
            <div
              className={`template-container ${isSelected ? "selected" : ""}`}
              onClick={() => handleTemplateClick(template)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              {template.thumbnail && (
                <img
                  src={template.thumbnail}
                  alt="Template"
                  className="img-hover tw-rounded-lg tw-max-w-40 tw-max-h-40 tw-w-full tw-h-auto tw-object-cover"
                />
              )}
              {isSelected && (
                <>
                  <div className="template-overlay"></div>
                  <div className="checkmark">✔</div>
                </>
              )}
            </div>
            {showTemplateDetails && (
              <>
                <div className="tw-text-black tw-font-bold tw-mt-1">
                  {template.title}
                </div>
                <div className="tw-text-gray-500 tw-mt-0">
                  {template.category}
                </div>
              </>
            )}
          </Col>
        );
      })}
    </Row>
  );
};

export default TemplatesDisplay;
