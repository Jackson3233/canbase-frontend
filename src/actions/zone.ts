import { axiosPrivateInstance } from "@/lib/axios";

const createZone = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/zone/createZone", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getZone = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/zone/getZone", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const addDiary = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/zone/addDiary", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateZone = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/zone/updateZone", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { createZone, getZone, addDiary, updateZone };
