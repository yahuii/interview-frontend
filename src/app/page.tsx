import Image from "next/image";
import styles from "./page.module.css";
import {Button} from "antd";
import {listQuestionBankVoByPageUsingPost} from "@/api/questionBankController";

export default function Home() {

  return (
    <main className={"main"}>
      <div className={styles.description}>
        <Button type="primary">Primary Button</Button>
      </div>


      <div>
        这是主页
      </div>
    </main>
  );
}
