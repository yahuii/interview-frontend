import "@chatui/core/dist/index.css";
import Chat, { Bubble, useMessages } from "@chatui/core";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import MdViewer from "@/components/MdViewer";

/**
 * 聊天室组件
 * @constructor
 */
const ChatCard = () => {
  const { messages, appendMsg, setTyping, updateMsg } = useMessages([]);
  const [msgID, setMsgID] = useState("");
  const [result, setResult] = useState("");
  const basePath = "localhost:8101/api/ws/chat";
  let sessionMsg = "";
  let msg = "";

  useEffect(() => {
    // 监听result的改变，来实现打字机效果
    updateMsg(msgID, {
      type: "text",
      content: { text: result },
    });
  }, [result]);

  function handleSend(type: string, val: string) {
    // 先设置一个唯一的msgID
    const msgID = nanoid();
    setMsgID(msgID);
    // 重置msg
    msg = "";
    // 重置对话框
    setResult(msg);
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      // 处理sessionMsg，保证上下文;
      sessionMsg += val;
      appendMsg({
        _id: msgID,
        type: "text",
        content: { text: result },
      });
      socket.send(sessionMsg);
    }
  }

  const socket = new WebSocket("ws://" + basePath);

  // 监听连接打开事件
  socket.addEventListener("open", (event) => {
    console.log("WebSocket 连接已打开");
  });
  // 监听收到消息事件
  socket.addEventListener("message", (event) => {
    console.log("收到服务器消息:", event.data);
    // 处理sessionMsg，保证上下文
    if (event.data === "[DONE]") {
      // 说明是结尾
      sessionMsg += "\n";
    } else {
      msg += event.data;
      setResult(msg);
      sessionMsg += event.data;
    }
  });
  // 监听连接关闭事件
  socket.addEventListener("close", (event) => {
    console.log("WebSocket 连接已关闭");
  });

  function renderMessageContent(msg: any) {
    const { content } = msg;
    // return <Bubble content={content.text} />;

    return <Bubble children={<MdViewer value={content.text} />}/>;
  }

  return (
    <div className={"chatcard"}>
      <Chat
        navbar={{ title: "智能助理" }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
      />
    </div>
  );
};

export default ChatCard;
