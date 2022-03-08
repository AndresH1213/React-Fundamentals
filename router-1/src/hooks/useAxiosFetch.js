import { useState, useEffect } from "react";
import axios from "axios";

const useAxiosFetch = (dataUrl) => {
  const [data, setData] = useState([]);
  const [fetchError, setFecthError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchData = async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url, {
          cancelToken: source.token,
        });
        if (isMounted) {
          setData(response.data);
          setFecthError(null);
        }
      } catch (error) {
        if (isMounted) {
          setFecthError(error.message);
          setData([]);
        }
      } finally {
        isMounted && setTimeout(() => setIsLoading(false), 2000);
      }
    };

    fetchData(dataUrl);

    const cleanUp = () => {
      console.log("clean up funtion");
      isMounted = false;
      source.cancel();
    };

    return cleanUp;
  }, [dataUrl]);

  return { data, fetchError, isLoading };
};

export default useAxiosFetch;
