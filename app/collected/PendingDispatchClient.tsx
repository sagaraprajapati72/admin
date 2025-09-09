
"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Collected from "./Collected";
import { User } from "../../lib/auth";

type Props = {
  user: User;
};

export default function PendingDispatchClient({ user }: Props) {
  return (
    <>
      <Header />
      <Collected />
      <Footer />
    </>
  );
}
