"use client"
import {Button, message, Popconfirm, PopconfirmProps, Space, Typography} from "antd";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-table";
import { PlusOutlined } from "@ant-design/icons";
import {
  deleteUserUsingPost,
  listUserByPageUsingPost,
} from "@/api/userController";
import {useRef, useState} from "react";
import CreateModal from "@/app/admin/user/components/CreateModal";
import UpdateModal from "@/app/admin/user/components/UpdateModal";
import {DEFAULT_USER} from "@/constants/user";

export default function bank() {

  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.User>();

  // 是否显示更新窗口
  const[updateModalVisible,setUpdateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();


  // 是否显示新建窗口
  const[createModalVisible,setCreateModalVisible] = useState<boolean>(false);

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    handleDelete(currentRow??DEFAULT_USER);
    message.success('删除成功');
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    message.error('已取消');
  };

  const columns: ProColumns<API.User>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
      hideInTable:true
    },
    {
      title: "账号",
      dataIndex: "userAccount",
      valueType: "text",
      hideInForm:updateModalVisible
    },
    {
      title: "用户名",
      dataIndex: "userName",
      valueType: "text",
    },
    {
      title: "头像",
      dataIndex: "userAvatar",
      valueType: "image",
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: "简介",
      dataIndex: "userProfile",
      valueType: "textarea",
    },
    {
      title: "权限",
      dataIndex: "userRole",
      valueEnum: {
        user: {
          text: "用户",
        },
        admin: {
          text: "管理员",
        },
      },
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
              title="删除用户"
              description="您确定要删除此用户吗?"
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

  const handleDelete = async (row: API.User) => {
    const hide = message.loading("正在删除");
    if (!row) return true;
    try {
      await deleteUserUsingPost({
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
      <ProTable<API.User>
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
          const { data,code } = await listUserByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.UserQueryRequest);
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
          oldData={currentRow??DEFAULT_USER}
          onSubmit={() => {
            setUpdateModalVisible(false);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
      />

    </main>
  );
}
