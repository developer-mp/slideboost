import { Col, Row } from "react-bootstrap";
import { FileDetailProps } from "../../interfaces/interfaces";
import { config } from "../../../env.config";
import { replaceExtension } from "../../utils/storage/replaceExtension";
import { removeExtension } from "../../utils/storage/removeExtension";

interface TemplatesDisplayProps {
  templates: FileDetailProps[];
  selectedTemplate?: FileDetailProps | null;
  onSelect?: (template: FileDetailProps | null) => void;
}

const TemplatesDisplay: React.FC<TemplatesDisplayProps> = ({
  templates,
  selectedTemplate,
  onSelect,
}) => {
  const handleTemplateClick = (template: FileDetailProps) => {
    if (onSelect) {
      const newSelectedTemplate =
        selectedTemplate?.file_id === template.file_id ? null : template;
      onSelect(newSelectedTemplate);
    }
  };

  return (
    <Row>
      {templates.map((template, index) => {
        const isSelected = selectedTemplate?.file_id === template.file_id;

        return (
          <Col xs={12} md={4} key={index} className="tw-mb-6">
            <div
              className={`template-container ${isSelected ? "selected" : ""}`}
              onClick={() => handleTemplateClick(template)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <img
                src={
                  template.file_path
                    ? `${config.DNS_ENDPOINT}/${replaceExtension(
                        template.file_path
                      )}`
                    : ""
                }
                alt={template.name}
                className="img-hover tw-rounded-lg tw-max-w-40 tw-max-h-40 tw-w-full tw-h-auto tw-object-cover"
              />
              {isSelected && (
                <>
                  <div className="template-overlay"></div>
                  <div className="checkmark">✔</div>
                </>
              )}
            </div>
            <div className="tw-text-black tw-font-bold tw-mt-1">
              {removeExtension(template.name)}
            </div>
            <div className="tw-text-gray-500 tw-mt-0">
              {template.template_category}
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default TemplatesDisplay;
