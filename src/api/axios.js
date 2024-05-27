import axios from "axios";
export const BASE_URL = "https://zpunktragback-3ktw2.ondigitalocean.app";

export default axios.create({
  baseURL: BASE_URL,
});
