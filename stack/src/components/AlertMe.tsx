import { Alert } from "react-bootstrap";
import React, { useState, useEffect } from "react";

interface AlertProps {
  variant: string;
  message: string;
  timeout?: number;
  showAlert?: boolean;
}

export const AlertMe = ({
  variant,
  message,
  timeout = 5,
  showAlert = true,
}: AlertProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, timeout * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout, showAlert]);

  return (
    <>
      {message.length > 0 ? (
        <>
          {show && (
            <Alert variant={variant} onClose={() => setShow(false)} dismissible>
              {message}
            </Alert>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
