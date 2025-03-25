import { axiosPrivateInstance } from "@/lib/axios";

const createMembership = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/membership/create", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateMembership = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/membership/update", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const removeMembership = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/membership/remove", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { createMembership, updateMembership, removeMembership };
