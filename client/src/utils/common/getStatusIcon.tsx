import { FaWifi } from "react-icons/fa";
import { ConnectionStatus } from "../../interfaces/types";

export const getStatusIcon = (status: ConnectionStatus) => {
  let className = "tw-text-gray-500";

  switch (status) {
    case "connected":
      className = "tw-text-green-500";
      break;
    case "connecting":
      className = "tw-text-yellow-500";
      break;
    case "error":
      className = "tw-text-red-500";
      break;
  }

  return <FaWifi className={className} />;
};
