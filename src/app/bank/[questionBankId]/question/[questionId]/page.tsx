"use server";
import Title from "antd/es/typography/Title";
import {getQuestionBankVoByIdUsingGet} from "@/api/questionBankController";
import "./index.css";
import Meta from "antd/es/card/Meta";
import {Avatar, Button, Card, Flex, Menu} from "antd";
import QuestionList from "@/components/QuestionList";
import React from "react";
import Paragraph from "antd/es/typography/Paragraph";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import {getQuestionVoByIdUsingGet} from "@/api/questionController";
import {ItemType, MenuItemType} from "antd/es/menu/interface";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";

/**
 * 题库列表页面
 * @constructor
 */
export default async function BankPage({
                                           params,
                                       }: {
    params: Record<string, number>;
}) {
    const {questionBankId, questionId} = params;

    let bank = undefined;

    try {
        const bankRes = await getQuestionBankVoByIdUsingGet({
            id: questionBankId,
            needQueryQuestionList: true,
            pageSize: 200,
        });
        bank = bankRes.data as API.QuestionBankVO;
    } catch (e: any) {
        console.error("获取题库详情失败，" + e.message);
    }

    if (!bank) {
        return <div>获取题库详情失败，请刷新重试</div>;
    }

    let question = undefined;
    try {
        const questionRes = await getQuestionVoByIdUsingGet({
            id: questionId,
        });
        question = questionRes.data as API.QuestionVO;
    }catch (e : any){
        console.error("获取题目详情失败," + e.message)
    }
    if(!question){
        return <div>获取题目详情失败，请刷新重试</div>
    }

    // 题目菜单列表
    // 题目菜单列表
    const questionMenuItemList = (bank.questionPage?.records || []).map(
        (question) => {
            return {
                label: <Link href={`/bank/${bank.id}/question/${question.id}`} prefetch={false}>{question.title}</Link>,
                key: question.id,
            };
        },
    ) as ItemType[];


    return (
        <div id="bankQuestionPage">
            <Flex gap={24}>
                <Sider width={240} theme="light" style={{padding: "24px 0"}}>
                    <Title level={4} style={{padding: "0 20px"}}>
                        题库标题
                    </Title>
                    <Menu items={questionMenuItemList} selectedKeys={[questionId.toString()]} />
                </Sider>
                <Content>
                    题目详情
                    <QuestionCard question={question} />
                </Content>
            </Flex>
        </div>

    );
}
