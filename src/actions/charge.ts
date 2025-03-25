import { axiosPrivateInstance } from "@/lib/axios";

const createCharge = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/charge/createCharge", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getCharge = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/charge/getCharge", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const addDiary = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/charge/addDiary", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateCharge = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/charge/updateCharge", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { createCharge, getCharge, addDiary, updateCharge };
