import { useCallback } from "react";
import { handleErrorMessage } from "../common/handleMessage";
import { showErrorToast } from "../common/handleToast";
import {
  useLazyGetFileMetadataQuery,
  useLazyGetSupportedFilesQuery,
} from "../../store/api/appApi";

const useFetchFileData = (userId: string) => {
  const [getSupportedFiles] = useLazyGetSupportedFilesQuery();
  const [getFileMetadata] = useLazyGetFileMetadataQuery();

  const handleSupportedFiles = useCallback(async () => {
    try {
      await getSupportedFiles(undefined, true).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while fetching the supported files: ",
        error,
      );
    }
  }, [getSupportedFiles]);

  const handleFileMetadata = useCallback(async () => {
    try {
      await getFileMetadata({ userId }, true).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error("Error occurred while fetching the file metadata: ", error);
    }
  }, [getFileMetadata, userId]);

  const fetchData = useCallback(() => {
    if (userId) {
      handleFileMetadata();
      handleSupportedFiles();
    }
  }, [userId, handleFileMetadata, handleSupportedFiles]);

  return fetchData;
};

export default useFetchFileData;
