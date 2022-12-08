import { useAuth } from "../auth";

export function useAPI() {
  const { auth } = useAuth();
  return {
    async get(pathname) {
      const res = await fetch(`${process.env.PREACT_APP_API_URL}${pathname}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
        },
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res.json().catch(() => ({}));
    },
    async post(pathname, json) {
      const res = await fetch(`${process.env.PREACT_APP_API_URL}${pathname}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
        },
        body: json ? JSON.stringify(json) : undefined,
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res.json().catch(() => ({}));
    },
    async put(pathname, json) {
      const res = await fetch(`${process.env.PREACT_APP_API_URL}${pathname}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
        },
        body: json ? JSON.stringify(json) : undefined,
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res.json().catch(() => ({}));
    },
    async delete(pathname) {
      const res = await fetch(`${process.env.PREACT_APP_API_URL}${pathname}`, {
        method: "DELETE",
        headers: {
          authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
        },
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res.json().catch(() => ({}));
    },
  };
}
