import { Message } from "@/app/page";

import { ChevronDownCircle } from "lucide-react";
import LoadingMessage from "./LoadingMessage";

interface Props {
  messages: Message[];
}

function Messages({ messages }: Props) {
  return (
    <div
      className={`flex flex-col min-h-screen p-5 pt-20 ${
        messages.length > 0 ? "pb-96" : "pb-32"
      }`}
    >
      <div className="flex flex-col flex-1 space-y-5 max-w-3xl mx-auto">
        <LoadingMessage />

        {!messages.length && (
          <div className="flex flex-col space-y-10 flex-1 items-center justify-end">
            <p className="text-gray-500 animate-pulse">Start a conversation</p>
            <ChevronDownCircle
              size={64}
              className="animate-bounce text-gray-500"
            />
          </div>
        )}

        <div className="p-5 space-y-5">
          {messages.map((message) => (
            <div key={message.id} className="space-y-5">
              {/* reciever */}
              <div className="pr-48">
                <p className="message bg-gray-800 rounded-bl-none">
                  {message.response}
                </p>
              </div>

              {/* sender */}
              <div className="pl-48">
                <p className="message text-left ml-auto rounded-br-none">
                  {message.sender}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Messages;
