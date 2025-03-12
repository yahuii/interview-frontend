import {ProColumns, ProTable} from "@ant-design/pro-table";
import {message, Modal} from "antd";
import {addUserUsingPost, updateUserUsingPost} from "@/api/userController";
import {updateQuestionBankUsingPost} from "@/api/questionBankController";

interface Props {
    visible: boolean;
    columns: ProColumns<API.QuestionBank>[];
    onSubmit: (values: API.QuestionBankUpdateRequest) => void;
    onCancel: () => void;
    oldData: API.QuestionBank | undefined;
}


export default function UpdateModal (props:Props){

    const handleUpdate = async (fields: API.QuestionBankUpdateRequest) => {
        const hide = message.loading("正在修改");
        try {
            await updateQuestionBankUsingPost(fields);
            hide();
            message.success("修改成功");
            return true;
        } catch (error: any) {
            hide();
            message.error("修改失败，" + error.message);
            return false;
        }
    };


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
                    initialValues: props.oldData,
                }}
                onSubmit={async (values: API.QuestionBankUpdateRequest) => {
                    if(!props.oldData?.id || !props.onSubmit) {
                        return;
                    }
                    const success = await handleUpdate({
                        ...values,
                        id: props.oldData.id,
                    });
                    if (success) {
                        props.onSubmit?.(values);
                    }
                }}
            />
        </Modal>
    );
}