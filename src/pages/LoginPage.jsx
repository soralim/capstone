import { Button, Col, Image, Row, Modal, Form, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const loginImage = "src/assets/hotel.png";
    const url = "https://71614d2a-dc59-4978-860d-9efccce24f05-00-2enh7o89sfh7s.pike.replit.dev";
    const [modalShow, setModalShow] = useState(null);
    const handleShowSignUp = () => setModalShow("Signup");
    const handleShowLogin = () => setModalShow("Login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");

    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            navigate("/view");
        }
    }, [authToken, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/signup`, { username, password });
            console.log("Signup success:", res.data);
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/login`, { username, password });
            if (res.data && res.data.auth === true && res.data.token) {
                setAuthToken(res.data.token);
                console.log("Login was successful, token saved");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
        }
    };

    const handleClose = () => setModalShow(null);

    return (
        <Row className="vh-100">
            <Col sm={12} className="p-0">
                <Image src={loginImage} fluid style={{ width: "100%", height: "50vh", objectFit: "cover" }} />
            </Col>
            <Col sm={12} className="d-flex align-items-center justify-content-center vh-100" style={{ marginTop: "-50vh" }}>
                <Container className="d-flex flex-column align-items-center justify-content-center bg-light p-5 shadow rounded" style={{ maxWidth: "500px" }}>
                    <p className="mt-5" style={{ fontSize: 64, color: "#000", textShadow: "2px 2px 8px rgba(255, 255, 255, 0.7)" }}>Hotel</p>

                    <Col sm={12} className="d-grid gap-2">
                    <h5>login   </h5>
                        <Button className="rounded-pill" onClick={handleShowSignUp}>Create an account</Button>

                        <p className="mt-5" style={{ fontWeight: "bold" }}>
                            Already have an account?
                        </p>
                        <Button
                            className="rounded-pill"
                            variant="outline-primary"
                            onClick={handleShowLogin}
                        >
                            Sign in
                        </Button>
                    </Col>
                </Container>
                <Modal show={modalShow !== null} onHide={handleClose} animation={false} centered>
                    <Modal.Body>
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                            {modalShow === "Signup" ? "Create your account" : "Log in to your account"}
                        </h2>
                        <Form
                            className="d-grid gap-2 px-5"
                            onSubmit={modalShow === "Signup" ? handleSignUp : handleLogin}
                        >
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    placeholder="Enter username"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Enter password"
                                />
                            </Form.Group>

                            <Button className="rounded-pill" type="submit">
                                {modalShow === "Signup" ? "Sign up" : "Log in"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>
        </Row>
    );
}
