import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { getSupportedFiles } from "../../store/actions/dataAction";
import { AppDispatch } from "../../store/store";
import { handleErrorMessage } from "../common/handleActionMessage";
import { showErrorToast } from "../common/handleToast";
import { getFileMetadata } from "../../store/actions/storageAction";

const useFetchFileData = (userId: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSupportedFiles = useCallback(async () => {
    try {
      await dispatch(getSupportedFiles()).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while fetching the supported files: ",
        error
      );
    }
  }, [dispatch]);

  const handleFileMetadata = useCallback(async () => {
    try {
      await dispatch(getFileMetadata({ userId })).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while fetching the file metadata: ", error);
    }
  }, [dispatch, userId]);

  const fetchData = useCallback(() => {
    if (userId) {
      handleFileMetadata();
      handleSupportedFiles();
    }
  }, [userId, handleFileMetadata, handleSupportedFiles]);

  return fetchData;
};

export default useFetchFileData;
