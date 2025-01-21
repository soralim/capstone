import { Button, Col, Table, Spinner, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function ProfileMidBody() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const url = 'https://71614d2a-dc59-4978-860d-9efccce24f05-00-2enh7o89sfh7s.pike.replit.dev';
    const [updatedBooking, setUpdatedBooking] = useState({
        title: "",
        room_type: "",
        date: "",
        time: "",
        phone_number: "",
        email: "",
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            setLoading(true);
            try {
                const response = await fetch(
                    `${url}/bookings?user_id=${userId}`,
                    {
                        method: "GET",
                    }
                );
                console.log(response);
                if (response.ok) {
                    const data = await response.json();
                    setBookings(data);
                } else {
                    console.error('Error:', response.status, response.statusText);
                }
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (bookingId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${url}/bookings/${bookingId}`,
                {
                    method: "DELETE",
                }
            );
            const data = await response.json();
            if (response.ok) {
                setBookings(bookings.filter((booking) => booking.id !== bookingId));
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (booking) => {
        setSelectedBooking(booking);
        setUpdatedBooking({
            title: booking.title,
            room_type: booking.room_type,
            date: booking.date,
            time: booking.time,
            phone_number: booking.phone_number,
            email: booking.email,
        });
        setShowEditModal(true);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setShowEditModal(false);
        try {
            const response = await fetch(
                `${url}/bookings/${selectedBooking.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedBooking),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setBookings(
                    bookings.map((b) =>
                        b.id === selectedBooking.id ? { ...b, ...updatedBooking } : b
                    )
                );
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error updating booking:", error);
        } finally {
            setLoading(false);
        }
    };

    const roomTypes = ["Single Room", "Double Room", "Suite", "Deluxe Room"];

    return (
        <Col sm={12} md={10} className="bg-light border rounded p-4">
            <h2 className="mb-4 text-center text-primary">User Bookings</h2>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="mt-3">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Title</th>
                                <th>Room Type</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.title}</td>
                                    <td>{booking.room_type}</td>
                                    <td>{booking.date}</td>
                                    <td>{booking.time}</td>
                                    <td>{booking.phone_number}</td>
                                    <td>{booking.email}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEdit(booking)}
                                        >
                                            <i className="bi bi-pencil"></i> Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(booking.id)}
                                        >
                                            <i className="bi bi-trash"></i> Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedBooking.title}
                                onChange={(e) =>
                                    setUpdatedBooking({ ...updatedBooking, title: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="editRoomType">
                            <Form.Label>Room Type</Form.Label>
                            <Form.Select
                                value={updatedBooking.room_type}
                                onChange={(e) =>
                                    setUpdatedBooking({
                                        ...updatedBooking,
                                        room_type: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Room Type</option>
                                {roomTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="editDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedBooking.date}
                                onChange={(e) =>
                                    setUpdatedBooking({ ...updatedBooking, date: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="editTime">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedBooking.time}
                                onChange={(e) =>
                                    setUpdatedBooking({ ...updatedBooking, time: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="editPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedBooking.phone_number}
                                onChange={(e) =>
                                    setUpdatedBooking({
                                        ...updatedBooking,
                                        phone_number: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="editEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={updatedBooking.email}
                                onChange={(e) =>
                                    setUpdatedBooking({ ...updatedBooking, email: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    );
}
