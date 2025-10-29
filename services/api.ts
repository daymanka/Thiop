// services/api.ts
import axios from "axios";
import { ODOO_URL, ODOO_DB, ODOO_USER_ID, ODOO_API_KEY } from "@env";

// ======== CONFIGURATION DE BASE ========
const ODOO_JSONRPC_URL = ODOO_URL || "http://localhost:8069/jsonrpc";
const DB_NAME = ODOO_DB || "odoo_db_thiop";
const USER_ID = Number(ODOO_USER_ID) || 2;
const API_KEY = ODOO_API_KEY;

// ======== INSTANCE AXIOS ========
const odooClient = axios.create({
  baseURL: ODOO_JSONRPC_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ======== MÉTHODE GÉNÉRIQUE POUR APPELER ODOO ========
export const callOdoo = async (
  model: string,
  method: string,
  args: any[] = [],
  kwargs: Record<string, any> = {}
) => {
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [DB_NAME, USER_ID, API_KEY, model, method, args, kwargs],
    },
    id: Date.now(),
  };

  const { data } = await odooClient.post("", payload);
  if (data?.error) {
    console.error("Odoo Error:", data.error);
    throw new Error(data.error.data?.message || "Erreur côté Odoo");
  }
  return data.result;
};

export default odooClient;
