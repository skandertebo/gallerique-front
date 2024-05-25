import axiosInstance from "../axiosInstance";
import ENDPOINTS from "../endpoints";

export default class FileService {
  static async uploadImage(file: File): Promise<{
    token: string;
  }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post<{
      token: string;
    }>(ENDPOINTS.UPLOAD_IMAGE, formData);
    return res.data;
  }
}
