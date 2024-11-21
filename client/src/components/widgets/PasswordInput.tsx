import { useRef, useEffect, InputHTMLAttributes } from "react";
import { Form, FormControlProps } from "react-bootstrap";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  FormControlProps;

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
  };

  const handleCopy = (e: ClipboardEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("paste", handlePaste);
      inputElement.addEventListener("copy", handleCopy);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("paste", handlePaste);
        inputElement.removeEventListener("copy", handleCopy);
      }
    };
  }, []);

  return <Form.Control ref={inputRef} type="password" {...props} />;
};

export default PasswordInput;
