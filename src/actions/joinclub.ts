import { axiosPublicInstance } from "@/lib/axios";

const getClubInfo = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/joinclub", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const confirmJoin = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/joinclub/confirmJoin", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const finalJoin = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/joinclub/finalJoin", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { getClubInfo, confirmJoin, finalJoin };
