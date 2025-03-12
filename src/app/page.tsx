"use server";
import Title from "antd/es/typography/Title";
import {Divider, Flex} from "antd";
import "./index.css";
import Link from "next/link";
import {listQuestionBankVoByPageUsingPost} from "@/api/questionBankController";
import {listQuestionVoByPageUsingPost} from "@/api/questionController";
import QuestionBankList from "@/components/QuestionBankList";
import QuestionList from "@/components/QuestionList";

/**
 * 主页
 * @constructor
 */
export default async function HomePage() {
  let questionBankList: API.QuestionBankVO[] = [];
  let questionList: API.QuestionVO[] = [];

  try {
    const questionBankRes = await listQuestionBankVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    questionBankList = questionBankRes.data.records ?? [];
  } catch (e: any) {
    console.error("获取题库列表失败，" + e.message);
  }

  try {
    const questionListRes = await listQuestionVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    questionList = questionListRes.data.records ?? [];
  } catch (e: any) {
    console.error("获取题目列表失败，" + e.message);
  }

  return (
    <div id="homePage" className={"max-width-content"}>
      <Flex justify="space-between" align="center">
        <Title level={3}>最新题库</Title>
        <Link href={"/bank"}>查看更多</Link>
      </Flex>

      <div>
        题库列表
        <QuestionBankList
          questionBankList={questionBankList}
        ></QuestionBankList>
      </div>
      <Divider />
      <Title level={3}>最新题目</Title>
      <div>
        题目列表
        <QuestionList questionList={questionList}></QuestionList>
      </div>
    </div>
  );
}
