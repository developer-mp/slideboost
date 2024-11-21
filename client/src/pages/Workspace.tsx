import { useState } from "react";
import SideBar from "../components/main/SideBar";
import Dashboard from "../components/main/Dashboard";
import MediaMenu from "../components/main/MediaMenu";
import TemplatesMenu from "../components/main/TemplatesMenu";
import Projects from "../components/main/Projects";

const Workspace: React.FC = () => {
  type MenuItem = "dashboard" | "media" | "projects" | "templates";

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(
    "dashboard"
  );

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="tw-bg-[#E7E6F4] tw-flex">
      <SideBar selectedItem={selectedItem} onItemClick={handleItemClick} />
      {selectedItem === "dashboard" && (
        <Dashboard setSelectedItem={setSelectedItem} />
      )}
      {selectedItem === "media" && <MediaMenu />}
      {selectedItem === "templates" && <TemplatesMenu />}
      {selectedItem === "projects" && <Projects />}
    </div>
  );
};

export default Workspace;
