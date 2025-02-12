"use client";

import { useFormStatus } from "react-dom";
import { BeatLoader } from "react-spinners";

function LoadingMessage() {
  const { pending } = useFormStatus();

  return (
    pending && (
      <p className="message mx-auto text-white">
        <BeatLoader color="white" />
      </p>
    )
  );
}

export default LoadingMessage;
