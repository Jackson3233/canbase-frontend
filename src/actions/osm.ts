import { axiosPrivateInstance } from "@/lib/axios";

const findNearestLayers = async (position: [number, number], layers: string[], limit: number) => {
  try {
    const result = await axiosPrivateInstance
      .get(`/osm/nearest?position=${encodeURIComponent(JSON.stringify(position))}&layers=${encodeURIComponent(JSON.stringify(layers))}&limit=${limit}`)
      .then((res) => res.data);

    return result;
  } catch (error) {
    console.error(error);
  }
};

export {
  findNearestLayers
};
