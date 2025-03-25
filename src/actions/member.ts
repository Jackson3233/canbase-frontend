import { axiosPrivateInstance } from "@/lib/axios";

const getMembers = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/member/getMembers")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateStatus = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/updateStatus", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getMember = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/getMember", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateMember = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/updateMember", data, {
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

const updateMemberSEPA = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/updateMemberSEPA", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateMemberMembership = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/updateMemberMembership", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateMemberRole = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/updateMemberRole", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateQuestion = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/updateQuestion", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const inviteMember = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/invite", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const removeMember = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/remove", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const removeQuestion = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/member/removeQuestion", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export {
  getMembers,
  updateStatus,
  getMember,
  updateMember,
  updateMemberSEPA,
  updateMemberMembership,
  updateMemberRole,
  updateQuestion,
  inviteMember,
  removeMember,
  removeQuestion,
};
