import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { SendHorizonal } from "lucide-react";
import CommunityToolbar from "./CommunityToolbar";
import { Button } from "../ui/button";
import { CommunityTiptapPropsInterface } from "@/types/component";

const CommunityTiptap = ({
  message,
  setMessage,
  disabled = false,
  documents,
  setDocuments,
  handleImages,
  votes,
  setVotes,
  onSend,
  imgsCount,
  docsCount,
  voteAvailable = true,
}: CommunityTiptapPropsInterface) => {
  const editor = useEditor({
    content: message,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Teile deine Gedanken..." }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: "overflow-y-auto h-16 w-full flex flex-col p-2 outline-none",
      },
    },
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
    <div className="relative flex items-center p-3 bg-[#F8F8F8] rounded-md">
      <div className="w-full flex flex-col">
        <EditorContent
          id="editor"
          style={{ whiteSpace: "pre-line" }}
          editor={editor}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between items-center">
          <CommunityToolbar
            editor={editor}
            message={message}
            setMessage={setMessage}
            documents={documents}
            setDocuments={setDocuments}
            handleImages={handleImages}
            votes={votes}
            setVotes={setVotes}
            imgsCount={imgsCount}
            docsCount={docsCount}
            voteAvailable={voteAvailable}
          />
          <Button
            className="p-1 h-auto hover:bg-transparent hover:text-customhover"
            type="button"
            variant="ghost"
            disabled={disabled || editor?.getText() === ""}
            onClick={handleSend}
          >
            <SendHorizonal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityTiptap;
