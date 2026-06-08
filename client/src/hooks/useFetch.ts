import { useEffect, useState } from "react";

type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export default function useFetch<T>(fetcher: () => Promise<Response>) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  const fetchData = async () => {
    setState({ status: "loading" });
    try {
      const res = await fetcher();
      if (!res.ok) throw new Error("서버 에러");
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
  }, []);

  return { state, fetchData };
}
