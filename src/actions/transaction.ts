import { axiosPrivateInstance } from "@/lib/axios";

const getFinance = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/transaction/getFinance")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const createTransaction = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/transaction/createTransaction", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const createAutoTransaction = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/transaction/createAutoTransaction", data, {
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

const getTransaction = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/transaction/getTransaction", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateTransaction = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/transaction/updateTransaction", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const uploadAttachments = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/transaction/uploadAttachments", data, {
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

const removeAttachments = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/transaction/removeAttachments", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export {
  getFinance,
  createTransaction,
  createAutoTransaction,
  getTransaction,
  updateTransaction,
  uploadAttachments,
  removeAttachments,
};
