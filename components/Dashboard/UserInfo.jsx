"use client";

import React from "react";
import Layout from "../SideNav/Layout";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const UserInfo = () => {
  const { data: session } = useSession();
  console.log(session);
  const updateLoginTime = async (userId) => {
    try {
      const res = await fetch("/api/updatelogintime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Failed to update login time");
      }
    } catch (error) {
      console.error("Error updating login time:", error);
    }
  };

  useEffect(() => {
    if (session && session.user) {
      updateLoginTime(session.user.id);
    }
  }, [session]);

  return (
    <Layout>
      <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6">
        <div>{session?.user?.id}</div>
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
      </div>
    </Layout>
  );
};

export default UserInfo;
