import { axiosPrivateInstance } from "@/lib/axios";

const getEvent = async () => {
  try {
    const result = await axiosPrivateInstance
      .get("/event")
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export { getEvent };
