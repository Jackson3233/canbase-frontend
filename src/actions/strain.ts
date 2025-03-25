import { axiosPrivateInstance } from "@/lib/axios";

const getGrowControl = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/strain/getGrowControl")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const createStrain = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/strain/createStrain", data, {
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

const getStrain = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/strain/getStrain", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const changeRate = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/strain/changeRate", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const addDiary = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/strain/addDiary", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateStrain = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/strain/updateStrain", data, {
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

export {
  getGrowControl,
  createStrain,
  getStrain,
  changeRate,
  addDiary,
  updateStrain,
};
