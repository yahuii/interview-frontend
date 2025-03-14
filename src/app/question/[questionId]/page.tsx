import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import { Flex } from "antd";
import React from "react";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import QuestionCard from "@/components/QuestionCard";
import "./index.css";

/**
 * 题目详情页面
 * @constructor
 */
export default async function QuestionPage({
                                               params,
                                           }: {
    params: Record<string, number>;
}) {
    const { questionId } = params;

    let question = undefined;
    try {
        const questionRes = await getQuestionVoByIdUsingGet({
            id: questionId,
        });
        question = questionRes.data as API.QuestionVO;
    } catch (e : any) {
        console.error("获取题目详情失败，" + e.message);
    }
    if (!question) {
        return <div>获取题目详情失败，请刷新重试</div>;
    }

    return (
        <div id="questionPage" className="max-width-content">
            <QuestionCard question={question} />
        </div>
    );
}
