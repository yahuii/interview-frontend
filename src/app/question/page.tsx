import styles from ".././page.module.css";
import { Button } from "antd";

export default function bank() {
  return (
    <main className={"main"}>
      <div className={styles.description}>
        <Button type="primary">Primary Button</Button>
      </div>

      <div>这是题目</div>
    </main>
  );
}
