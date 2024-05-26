import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RedirectToExternal = () => {
  const { url } = useParams();

  useEffect(() => {
    if (!url) return;
    const decodedUrl = decodeURIComponent(url);
    window.location.href = decodedUrl;
  }, [url]);

  return null;
};

export default RedirectToExternal;
