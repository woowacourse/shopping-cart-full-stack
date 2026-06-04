import { useEffect, useState } from "react";

type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export default function useFetch<T>(url: string) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  const fetchData = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setState({ status: "success", data });
    } catch (error) {
      setState({
        status: "error",
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [url]);
  return { state, fetchData };
}
