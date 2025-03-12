import React from "react";
import "./index.css";
import Link from "next/link";

export default function GlobalFooter() {
  return (
    <div className={"global-footer"}>
      <div>面试刷题平台</div>
      <Link href={"https://github.com/yahuii"} target={"_blank"}>
        by 顾琴
      </Link>
    </div>
  );
}
