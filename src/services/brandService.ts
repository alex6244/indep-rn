import type { Brand } from "../types/brand";

const MOCK_BRANDS: Brand[] = [
  { id: "kia", name: "Kia" },
  { id: "hyundai", name: "Hyundai" },
  { id: "lada", name: "LADA" },
  { id: "baic", name: "BAIC" },
  { id: "skoda", name: "Skoda" },
  { id: "haval", name: "Haval" },
  { id: "chery", name: "Chery" },
  { id: "kaiyi", name: "KAIYI" },
  { id: "solaris", name: "Solaris" },
  { id: "renault", name: "Renault" },
  { id: "uaz", name: "УАЗ" },
  { id: "geely", name: "Geely" },
  { id: "toyota", name: "Toyota" },
  { id: "bmw", name: "BMW" },
  { id: "mercedes", name: "Mercedes" },
  { id: "volkswagen", name: "Volkswagen" },
];

export const brandService = {
  async getAll(): Promise<Brand[]> {
    // TODO: replace with real API call when backend is ready:
    // const res = await fetch(`${API_BASE}/brands`);
    // return res.json();
    return MOCK_BRANDS;
  },
};
