import { axiosPrivateInstance } from "@/lib/axios";

const getQuestion = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/question")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const createQuestion = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/question/create", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const defaultQuestion = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/question/default", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateQuestion = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/question/update", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const removeQuestion = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/question/remove", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export {
  getQuestion,
  createQuestion,
  defaultQuestion,
  updateQuestion,
  removeQuestion,
};
