import api from "./axiosConfig";

function unwrap(res) {
  const body = res?.data;
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return { ...res, data: body.data };
  }
  return res;
}

<<<<<<< HEAD
export const getAllBom = async () => unwrap(await api.get("/api/masters/bom"));

/** Alias used by BomMaster page */
export const getBillOfMaterials = getAllBom;

export const getProductBom = async (productId) =>
  unwrap(await api.get(`/api/masters/bom/product/${productId}`));

export const addBomItem = async (productId, payload) =>
  unwrap(await api.post("/api/masters/bom", { ...payload, product_id: productId }));

export const deleteBomItem = async (bomId) =>
  unwrap(await api.delete(`/api/masters/bom/${bomId}`));
=======
export const getBillOfMaterials = async () => unwrap(await api.get("/api/masters/bom"));
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
