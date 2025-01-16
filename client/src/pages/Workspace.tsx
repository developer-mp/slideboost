import { useEffect, useState } from "react";
import SideBar from "../components/main/SideBar";
import Dashboard from "../components/main/Dashboard";
import MediaMenu from "../components/main/MediaMenu";
import TemplatesMenu from "../components/main/TemplatesMenu";
import Projects from "../components/main/Projects";
import { MenuItem } from "../interfaces/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getFileMetadata } from "../store/actions/storageAction";

const Workspace: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(
    "dashboard"
  );

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        await dispatch(getFileMetadata({ userId })).unwrap();
      } catch (error) {
        console.error("Error fetching file metadata: ", error);
      }
    };

    if (userId) {
      fetchMetadata();
    }
  }, [userId, dispatch]);

  return (
    <div
      className="tw-bg-[#E7E6F4] tw-flex"
      style={{
        minHeight: "calc(100vh - var(--navbar-height) - var(--footer-height))",
      }}
    >
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
