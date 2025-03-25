import { axiosPrivateInstance } from "@/lib/axios";

const createHarvest = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/harvest/createHarvest", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getHarvest = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/harvest/getHarvest", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const addDiary = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/harvest/addDiary", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateHarvest = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/harvest/updateHarvest", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { createHarvest, getHarvest, addDiary, updateHarvest };
