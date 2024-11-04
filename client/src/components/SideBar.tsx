import { RxDashboard } from "react-icons/rx";
import { MdOutlinePermMedia } from "react-icons/md";
import { FaRegFolder, FaRegFileAlt } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";

type MenuItem = "dashboard" | "media" | "templates" | "projects";

interface SideBarProps {
  selectedItem: MenuItem | null;
  onItemClick: (item: MenuItem) => void;
}

const SideBar: React.FC<SideBarProps> = ({ selectedItem, onItemClick }) => {
  return (
    <div
      className="tw-bg-[#E7E6F4] tw-p-4 tw-w-64 tw-border-r tw-border-gray-300"
      style={{ minHeight: "77.8vh" }}
    >
      <Row>
        <Col>
          <ul className="tw-list-none tw-p-0">
            <li
              className={`sidebar-menu-item ${
                selectedItem === "dashboard" ? "selected" : ""
              }`}
              onClick={() => onItemClick("dashboard")}
            >
              <RxDashboard className="tw-mr-2 tw-text-custom-color-teal tw-text-2xl" />
              <span>Dashboard</span>
            </li>
            <li
              className={`sidebar-menu-item ${
                selectedItem === "media" ? "selected" : ""
              }`}
              onClick={() => onItemClick("media")}
            >
              <MdOutlinePermMedia className="tw-mr-2 tw-text-custom-color-teal tw-text-2xl" />
              <span>Media</span>
            </li>
            <li
              className={`sidebar-menu-item ${
                selectedItem === "templates" ? "selected" : ""
              }`}
              onClick={() => onItemClick("templates")}
            >
              <FaRegFileAlt className="tw-mr-2 tw-text-custom-color-teal tw-text-2xl" />
              <span>Templates</span>
            </li>
            <li
              className={`sidebar-menu-item ${
                selectedItem === "projects" ? "selected" : ""
              }`}
              onClick={() => onItemClick("projects")}
            >
              <FaRegFolder className="tw-mr-2 tw-text-custom-color-teal tw-text-2xl" />
              <span>Projects</span>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default SideBar;
