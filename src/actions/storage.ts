import { axiosPrivateInstance } from "@/lib/axios";

const createStorage = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/storage/createStorage", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getStorage = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/storage/getStorage", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateStorage = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/storage/updateStorage", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { createStorage, getStorage, updateStorage };
