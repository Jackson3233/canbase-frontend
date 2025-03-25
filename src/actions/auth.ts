import { axiosPublicInstance } from "@/lib/axios";

const signIn = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/auth/login", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const twoFAVerify = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/auth/twoFAVerify", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const signUp = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/auth/register", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const forgotPass = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/auth/forgot", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const resetPass = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/auth/resetPass", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const confirmEmail = async (data: any) => {
  try {
    const result = await axiosPublicInstance
      .post("/auth/confirmEmail", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { signIn, twoFAVerify, signUp, forgotPass, resetPass, confirmEmail };
