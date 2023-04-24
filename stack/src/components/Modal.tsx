import { Modal, Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks";
import { reauthenticateUser, setIsCancelled } from "../slice/UserSlice";

interface ModalProps {
  modalShow: boolean;
}

export const ModalLogin = (props: ModalProps) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(props.modalShow);
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const handleClose = () => {
    dispatch(setIsCancelled(true));
    setShow(false);
  };

  useEffect(() => {
    setShow(props.modalShow);
  }, [props.modalShow]);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(reauthenticateUser({ email: email, password: password }));
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        dispatch(setIsCancelled(true));
      }}
    >
      <Modal.Header closeButton></Modal.Header>
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
          className="button"
          type="button"
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
