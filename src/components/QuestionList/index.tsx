"use client";
import { Card, List, Tag } from "antd";
import "./index.css";
import Link from "next/link";

interface Props {
    cardTitle?: React.ReactNode;
    questionList: API.QuestionVO[];
}


/**
 * 题目列表组件
 * @param props
 * @constructor
 */
const QuestionList = (props: Props) => {
    const { questionList = [] ,cardTitle} = props;

    const tagList = (tags: string[] = []) => {
        return tags.map((tag) => {
            return <Tag key={tag}>{tag}</Tag>;
        });
    };

    return (
        <Card className="question-list" title={cardTitle}>
        <List
                dataSource={questionList}
                renderItem={(item: API.QuestionVO) => (
                    <List.Item extra={tagList(item.tags)}>
                        <List.Item.Meta
                            title={<Link href={`/question/${item.id}`}>{item.title}</Link>}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default QuestionList;
