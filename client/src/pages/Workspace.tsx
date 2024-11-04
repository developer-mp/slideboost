import { useState } from "react";
import SideBar from "../components/SideBar";
import Dashboard from "../components/Dashboard";
import MediaMenu from "../components/MediaMenu";
import TemplatesMenu from "../components/TemplatesMenu";
import Projects from "../components/Projects";

const Workspace: React.FC = () => {
  type MenuItem = "dashboard" | "media" | "projects" | "templates";

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="tw-bg-[#E7E6F4] tw-flex">
      <SideBar selectedItem={selectedItem} onItemClick={handleItemClick} />
      {selectedItem === "dashboard" && <Dashboard />}
      {selectedItem === "media" && <MediaMenu />}
      {selectedItem === "templates" && <TemplatesMenu />}
      {selectedItem === "projects" && <Projects />}
    </div>
  );
};

export default Workspace;
