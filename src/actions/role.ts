import { axiosPrivateInstance } from "@/lib/axios";

const createRole = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/role/createRole", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateRole = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/role/updateRole", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const deleteRole = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/role/deleteRole", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { createRole, updateRole, deleteRole };
