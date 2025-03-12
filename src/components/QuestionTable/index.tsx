"use client";

import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-table";
import { useRef, useState } from "react";
import Link from "next/link";
import TagList from "@/components/TagList";
import { TablePaginationConfig } from "antd";

interface Props {
  defaultQuestionList?: API.QuestionVO[];
  defaultTotal?: number;
  defaultSearchParams?: API.QuestionQueryRequest;
}

/**
 * 题目表格组件
 * @constructor
 */
export default function QuestionTable(props: Props) {
  const { defaultQuestionList, defaultTotal,defaultSearchParams } = props;

  const actionRef = useRef<ActionType>();

  const [questionList, setQuestionList] = useState<API.QuestionVO[]>(
    defaultQuestionList || [],
  );

  const [total, setTotal] = useState<number>(defaultTotal || 0);

  const [init, setInit] = useState<boolean>(true);
  /**
   * 表格列配置
   */
  const columns: ProColumns<API.QuestionVO>[] = [
    {
      title: "题目",
      dataIndex: "title",
      render(_, record) {
        return <Link href={`/question/${record.id}`}>{record.title}</Link>;
      },
    },
    {
      title: "标签",
      dataIndex: "tagList",
      valueType: "select",
      fieldProps: {
        mode: "tags",
      },
      render: (_, record) => <TagList tagList={record.tags} />,
    },
  ];

  return (
    <div className="question-table">
      <ProTable
        dataSource={questionList}
        actionRef={actionRef}
        columns={columns}
        size="large"
        form={{
          initialValues:defaultSearchParams,
        }}
        search={{
          labelWidth: "auto",
        }}
        pagination={
          {
            pageSize: 12,
            showTotal: (total) => `总共 ${total} 条`,
            showSizeChanger: false,
            total,
          } as TablePaginationConfig
        }
        request={async (params, sort, filter) => {
          // 首次请求
          if (init) {
            setInit(false);
            if (defaultTotal && defaultQuestionList) {
              return {
                success: true,
                data: defaultQuestionList,
                total: defaultTotal,
              };
            }
          }

          const sortField = Object.keys(sort)?.[0] || "createTime";
          const sortOrder = sort?.[sortField] ?? "descend";
          //
          // // 请求
          // @ts-ignore
          const { data, code } = await listQuestionVoByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.UserQueryRequest);
          // // 更新结果
          const newTotal = Number(data.total) || 0;
          setTotal(newTotal);
          const newData = data.records || [];
          setQuestionList(newData);
          return {
            success: code === 0,
            data: newData,
            total: newTotal,
          };
        }}
      />
    </div>
  );
}
