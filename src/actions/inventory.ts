import { axiosPrivateInstance } from "@/lib/axios";

const getInventories = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/inventory/getInventories")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const createInventory = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/inventory/createInventory", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getInventory = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/inventory/getInventory", data)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateInventory = async (data: any) => {
  try {
    const result = await axiosPrivateInstance
      .post("/inventory/updateInventory", { ...data })
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { getInventories, createInventory, getInventory, updateInventory };
