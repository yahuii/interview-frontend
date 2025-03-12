import Title from "antd/es/typography/Title";
import QuestionTable from "@/components/QuestionTable";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import "./index.css";

/**
 * 题目列表页面
 * @constructor
 */
export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Record<string, undefined>;
}) {
  const { q: searchText } = searchParams;

  let questionList: API.QuestionVO[] = [];
  let total = 0;

  try {
    const questionRes = await listQuestionVoByPageUsingPost({
      title: searchText,
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    questionList = questionRes.data.records ?? [];
    total = questionRes.data.total ?? 0;
  } catch (e: any) {
    console.error("获取题目列表失败，" + e.message);
  }

  return (
    <div id="questionsPage" className="max-width-content">
      <Title level={3}>题目大全</Title>
      <div>题目内容</div>
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{ title: searchText }}
      />
    </div>
  );
}
