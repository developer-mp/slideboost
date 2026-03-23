import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useUploadPowerPointTemplateMutation } from "../../store/api/appApi";

const PowerPointUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [slideText, setSlideText] = useState<string>("");
  const [uploadPowerPointTemplate] = useUploadPowerPointTemplateMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlideText(event.target.value);
  };

  const handleDownload = async () => {
    if (!file || !slideText) {
      alert("Please upload a template and enter text.");
      return;
    }

    const formData = new FormData();
    formData.append("template", file);
    formData.append("text", slideText);

    try {
      const response = await uploadPowerPointTemplate(formData).unwrap();
      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = "presentation.pptx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading the presentation:", error);
    }
  };

  return (
    <div className="container">
      <h1>Upload PowerPoint Template</h1>
      <Form>
        <Form.Group controlId="formFile">
          <Form.Label>Upload PowerPoint Template</Form.Label>
          <Form.Control
            type="file"
            accept=".pptx"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Form.Group controlId="formText">
          <Form.Label>Text for Slide</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter text for the slide"
            onChange={handleTextChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleDownload}>
          Download Presentation
        </Button>
      </Form>
    </div>
  );
};

export default PowerPointUploader;
