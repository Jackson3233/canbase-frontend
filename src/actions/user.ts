import { axiosPrivateInstance } from "@/lib/axios";

const getData = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/user/getData")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateUser = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/user/update", data, {
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

const acceptRequest = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/user/accept", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const cancelRequest = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/user/cancel", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const removeAccount = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/user/remove", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const academyMedia = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/user/academy_media", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const confirmPass = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/user/confirmPass", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const twoFARequest = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/user/twoFARequest", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export {
  getData,
  updateUser,
  acceptRequest,
  cancelRequest,
  removeAccount,
  academyMedia,
  confirmPass,
  twoFARequest,
};
