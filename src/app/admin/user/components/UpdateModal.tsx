import {ProColumns, ProTable} from "@ant-design/pro-table";
import {message, Modal} from "antd";
import {addUserUsingPost, updateUserUsingPost} from "@/api/userController";

interface Props {
    visible: boolean;
    columns: ProColumns<API.User>[];
    onSubmit: (values: API.UserUpdateRequest) => void;
    onCancel: () => void;
    oldData: API.User;
}


export default function UpdateModal (props:Props){

    const handleUpdate = async (fields: API.UserUpdateRequest) => {
        const hide = message.loading("正在修改");
        try {
            await updateUserUsingPost(fields);
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
                onSubmit={async (values: API.UserUpdateRequest) => {
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