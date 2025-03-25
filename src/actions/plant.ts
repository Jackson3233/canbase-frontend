import { axiosPrivateInstance } from "@/lib/axios";

const createPlant = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/plant/createPlant", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getPlant = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/plant/getPlant", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const addDiary = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/plant/addDiary", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updatePlant = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/plant/updatePlant", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { createPlant, getPlant, addDiary, updatePlant };
