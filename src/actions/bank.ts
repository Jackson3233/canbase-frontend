import { axiosPrivateInstance } from "@/lib/axios";

const updateBank = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/bank/updateBank", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateBill = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/bank/updateBill", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateBook = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/bank/updateBook", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { updateBank, updateBill, updateBook };
