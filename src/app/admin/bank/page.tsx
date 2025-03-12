"use client";
import {
  Button,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Typography,
} from "antd";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-table";
import { PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { DEFAULT_USER } from "@/constants/user";
import {
  deleteQuestionBankUsingPost,
  listQuestionBankByPageUsingPost,
} from "@/api/questionBankController";
import UpdateModal from "@/app/admin/bank/components/UpdateModal";
import CreateModal from "@/app/admin/bank/components/CreateModal";

export default function bank() {
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.QuestionBank>();

  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    handleDelete(currentRow);
    message.success("删除成功");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    message.error("已取消");
  };

  const columns: ProColumns<API.QuestionBank>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
    },
    {
      title: "描述",
      dataIndex: "description",
      valueType: "text",
    },
    {
      title: "图片",
      dataIndex: "picture",
      valueType: "image",
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: "创建时间",
      sorter: true,
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "编辑时间",
      sorter: true,
      dataIndex: "editTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "更新时间",
      sorter: true,
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Popconfirm
            title="删除题库"
            description="您确定要删除此题库吗?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <Typography.Link type="danger" onClick={() => setCurrentRow(record)}>
              删除
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (row: API.QuestionBank | undefined) => {
    const hide = message.loading("正在删除");
    if (!row) return true;
    try {
      await deleteQuestionBankUsingPost({
        id: row.id as any,
      });
      hide();
      message.success("删除成功");
      // 删除成功后刷新表格
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error("删除失败，" + error.message);
      return false;
    }
  };

  return (
    <main className={"main"}>
      <ProTable<API.QuestionBank>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField];

          // @ts-ignore
          const { data, code } = await listQuestionBankByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionBankQueryRequest);
          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      ></UpdateModal>
    </main>
  );
}
