import {ProColumns, ProTable} from "@ant-design/pro-table";
import {message, Modal} from "antd";
import {addUserUsingPost} from "@/api/userController";
import {addQuestionBankUsingPost} from "@/api/questionBankController";

interface Props {
    visible: boolean;
    columns: ProColumns<API.QuestionBank>[];
    onSubmit: (values: API.QuestionBankAddRequest) => void;
    onCancel: () => void;
}


export default function CreateModal (props:Props){

    const handleAdd = async (fields: API.QuestionBankAddRequest) => {
        const hide = message.loading("正在添加");
        try {
            await addQuestionBankUsingPost(fields);
            hide();
            message.success("创建成功");
            return true;
        } catch (error: any) {
            hide();
            message.error("创建失败，" + error.message);
            return false;
        }
    };


    return (
        <Modal
            destroyOnClose
            title={"创建"}
            open={props.visible}
            footer={null}
            onCancel={() => {
                props.onCancel?.();
            }}
        >
            <ProTable
                type="form"
                columns={props.columns}
                onSubmit={async (values: API.QuestionBankAddRequest) => {
                    const success = await handleAdd(values);
                    if (success) {
                        props.onSubmit?.(values);
                    }
                }}
            />
        </Modal>
    );
}