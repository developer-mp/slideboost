import React, { useRef } from "react";
import { VerificationCodeInputProps } from "../../interfaces/interfaces";

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  code,
  setCode,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      const newCode = code.split("");
      newCode[index] = value;
      setCode(newCode.join(""));

      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!inputsRef.current[index]?.value) {
        if (index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
      } else {
        const newCode = code.split("");
        newCode[index] = "";
        setCode(newCode.join(""));
      }
    }
  };

  return (
    <div className="tw-flex tw-gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={code[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputsRef.current[index] = el)}
          className="tw-w-10 tw-h-10 tw-text-center tw-text-lg tw-border tw-border-gray-300 tw-rounded"
        />
      ))}
    </div>
  );
};

export default VerificationCodeInput;
