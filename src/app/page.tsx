"use client";
import transcript from "@/actions/transcript";
import Messages from "@/components/Messages";
import Recorder from "@/components/Recorder";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import Logo from "logo.png";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

export type Message = {
  sender: string;
  response: string;
  id: string;
};

export default function Home() {
  const fileRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [state, formAction] = useActionState(transcript, initialState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displaySettings, setDisplaySettings] = useState(false);

  useEffect(() => {
    if (state.response && state.sender) {
      setMessages((messages) => [
        ...messages,
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
      ]);
    }
  }, [state]);

  const uploadAudio = (blob: Blob) => {
    const file = new File([blob], "audio.webm", { type: blob.type });

    // Set the file as the value of the hidden input field
    if (fileRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // simulate a click and submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };
  return (
    <main className="bg-black h-screen overflow-y-scroll">
      <header className="flex fixed top-0 justify-between text-white w-full p-5">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />

        <SettingsIcon
          className="p-2 m-2 rounded-full cursor-pointer bg-purple-600 text-black transition-all ease-in-out duration-150 hover:bg-purple-700 hover:text-white"
          onClick={() => setDisplaySettings(!displaySettings)}
          size={40}
        />
      </header>

      <form action={formAction} className="flex flex-col bg-black">
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
          <Messages messages={messages} />
        </div>

        <input type="file" ref={fileRef} name="audio" hidden />
        <button type="submit" ref={submitButtonRef} hidden />

        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          <Recorder uploadAudio={uploadAudio} />
          <div className="">
            <VoiceSynthesizer state={state} displaySettings={displaySettings} />
          </div>
        </div>
      </form>
    </main>
  );
}
