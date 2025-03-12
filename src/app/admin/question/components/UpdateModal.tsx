import { ProColumns, ProTable } from "@ant-design/pro-table";
import { message, Modal } from "antd";
import { updateQuestionUsingPost } from "@/api/questionController";
import {useEffect} from "react";

interface Props {
  visible: boolean;
  columns: ProColumns<API.Question>[];
  onSubmit: (values: API.QuestionUpdateRequest) => void;
  onCancel: () => void;
  oldData: API.Question | undefined;
}

export default function UpdateModal(props: Props) {
  const handleUpdate = async (fields: API.QuestionUpdateRequest) => {
    const hide = message.loading("正在修改");
    try {
      await updateQuestionUsingPost(fields);
      hide();
      message.success("修改成功");
      return true;
    } catch (error: any) {
      hide();
      message.error("修改失败，" + error.message);
      return false;
    }
  };

// 表单转换
  let initValues = { ...props.oldData };
  if (props.oldData?.tags) {
    initValues.tags = JSON.parse(props.oldData.tags) || [];
  }


  return (
    <Modal
      destroyOnClose
      title={"修改"}
      open={props.visible}
      footer={null}
      onCancel={() => {
        props.onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={props.columns}
        form={{
          initialValues: initValues,
        }}
        onSubmit={async (values: API.QuestionUpdateRequest) => {
          if (!initValues?.id || !props.onSubmit) {
            return;
          }
          const success = await handleUpdate({
            ...values,
            id: initValues.id,
          });
          if (success) {
            props.onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
}
