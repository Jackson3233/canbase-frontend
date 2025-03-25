import { axiosPrivateInstance } from "@/lib/axios";

const getAllChannels = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/chat/getAllChannels")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getChatData = async (param: string) => {
  try {
    const result = await axiosPrivateInstance
      .get("/chat/getChatData/" + param)
      .then((res) => res.data);
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
  }
};

const setUserAllow = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/chat/privateUserAllow", data)
      .then((res) => res.data);

    return result;

  } catch (error) {
    console.error(error);
    throw error; // Optional: rethrow the error for further handling
  }
};

const setUserDelete = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/chat/privateUserDelete", data)
      .then((res) => res.data);

    return result;

  } catch (error) {
    console.error(error);
    throw error; // Optional: rethrow the error for further handling
  }
};

const addRemainedUser = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/chat/privateUserAdd", data)
      .then((res) => res.data);

    return result;

  } catch (error) {
    console.error(error);
    throw error; // Optional: rethrow the error for further handling
  }
}

export { getAllChannels, getChatData, setUserAllow, setUserDelete, addRemainedUser };
