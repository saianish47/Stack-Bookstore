import { Modal, Button, Form } from "react-bootstrap";
import React, { useState } from "react";
// import { AuthCredential, EmailAuthProvider } from "firebase/auth";

interface ModalProps {
  promptForCredentials: (email: string, password: string) => void;
  modalShow: boolean;
}

export const ModalLogin = (props: ModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(props.modalShow);
  //   React.useEffect(() => {
  //     if (!show) {
  //       //   reject(new Error("User canceled login"));
  //     }
  //   }, [show]);
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const handleClose = () => {
    setShow(false);
    // reject(new Error("User canceled login"))
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.promptForCredentials(email, password);
    setShow(false);

    // resolve(EmailAuthProvider.credential(email, password));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Sign in to reauthenticate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
