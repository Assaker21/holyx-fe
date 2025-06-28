import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "https://holyx-api.onrender.com"; //"http://localhost:3000";

export default function useApi({
  settings = { url: "", body: (b) => b, method: "GET" },
  callOnMount,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(0);

  async function call(object = {}) {
    const { params, query, body, files, silent } = object;
    let url = `${baseUrl}${settings.url}`;
    if (params && typeof params === "object") {
      Object.keys(params).forEach((key) => {
        url = url.replace(`:${key}`, params[key]);
      });
    }

    if (query && typeof query === "object") {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    }

    const formattedBody = settings.body ? settings.body(body) : body;
    let sentData = formattedBody;
    if (files) {
      sentData = new FormData();
      files.map((file) => {
        sentData.append("files", file);
      });
      sentData.append("body", JSON.stringify(formattedBody));
    }

    let response, error, data;
    try {
      if (!silent) setLoading((curr) => curr + 1);

      const axiosConfig = {
        method: settings.method,
        url,
        headers: {
          "Content-Type": files ? "multipart/form-data" : "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: sentData,
      };
      const promise = axios(axiosConfig);

      response = await promise;

      setData(response.data.body ?? response.data);
      setError(null);
      data = response.data.body ?? response.data;
    } catch (err) {
      response = err.response;
      setError(err.response?.data || err.message || "Something went wrong");
      setData(null);
      error = err.response?.data || err.message || "Something went wrong";
    } finally {
      if (!silent) setLoading((curr) => curr - 1);
    }

    return { ok: response.status < 300 && response.status >= 200, data, error };
  }

  useEffect(() => {
    if (!data && callOnMount) {
      call(callOnMount === true ? {} : callOnMount);
    }
  }, []);

  return { data, error, loading: Boolean(loading), call, setData, setError };
}
