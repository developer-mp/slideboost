import { Dropdown } from "react-bootstrap";
import { CustomDropdownProps } from "../../interfaces/interfaces";

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedOption,
  onOptionChange,
}) => {
  return (
    <Dropdown className="tw-mb-4 tw-w-40">
      <Dropdown.Toggle
        id="dropdown-basic"
        className="tw-w-full dropdown-toggle-menu"
      >
        {selectedOption}
      </Dropdown.Toggle>
      <Dropdown.Menu className="tw-w-full dropdown-menu">
        {options.map(({ id, label }) => (
          <Dropdown.Item key={id} onClick={() => onOptionChange(label)}>
            {label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
