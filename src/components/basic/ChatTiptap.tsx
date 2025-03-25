import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { SendHorizonal } from "lucide-react";
import ChatToolbar from "./ChatToolbar";
import { Button } from "../ui/button";
import { TiptapPropsInterface } from "@/types/component";

const ChatTiptap = ({
  message,
  disabled,
  setMessage,
  onSend,
}: TiptapPropsInterface) => {
  const editor = useEditor({
    content: message,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Chatten Sie mit Clubmitgliedern...",
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: "overflow-y-auto h-16 w-full flex flex-col p-2 outline-none",
      },
    },
    editable: !disabled,
    onUpdate: ({ editor }) => {
      setMessage(editor.getHTML());
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSend();
    }
  };

  const handleSend = () => {
    onSend(message);

    setMessage("");
    editor?.commands.setContent("");
  };

  return (
    <div className="relative flex items-center border rounded-md mt-3">
      <div className="w-full flex flex-col">
        <ChatToolbar
          editor={editor}
          message={message}
          setMessage={setMessage}
          disabled={disabled}
        />
        <EditorContent
          id="editor"
          style={{ whiteSpace: "pre-line" }}
          editor={editor}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        className="hover:bg-transparent hover:text-customhover"
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled || editor?.getText() === ""}
        onClick={handleSend}
      >
        <SendHorizonal className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatTiptap;
