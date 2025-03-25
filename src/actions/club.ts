import { axiosPrivateInstance } from "@/lib/axios";

const getAllClubs = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/club/all")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const createClub = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/club/create", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const joinClub = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/club/join", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateClub = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/club/update", data, {
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

const updateGeneral = async (data: any) => {
  try {
    console.log('Sending data to updateGeneral:', data);
    const result = await axiosPrivateInstance
      .post("/club/updateGeneral", data)
      .then((res) => res.data);
    console.log('Response from updateGeneral:', result);
    return result;
  } catch (error) {
    console.error('Error in updateGeneral:', error);
    throw error;
  }
};

const updateColor = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/club/color", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateCard = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/club/updateCard", data, {
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
const uploadDoc = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/club/uploadDoc", data, {
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

const removeDoc = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/club/removeDoc", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getPublicClub = async (clubId: string) => {
  try {
    const result = await axiosPrivateInstance
      .get(`/club/public/${clubId}`)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
    return { success: false, message: "Club nicht gefunden" };
  }
};

export {
  getAllClubs,
  createClub,
  joinClub,
  updateClub,
  updateGeneral,
  updateColor,
  updateCard,
  uploadDoc,
  removeDoc,
  getPublicClub
};
