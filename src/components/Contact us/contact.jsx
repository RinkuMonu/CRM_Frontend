import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import {
  EnvelopeFill,
  TelephoneFill,
  GeoAltFill,
  Building,
  PersonCircle,
  Headset,
  ChatDotsFill,
  Globe2,
  ClockFill,
  Link45deg,
} from "react-bootstrap-icons";

const ContactUsStatic = () => {
  return (
    <div className="p-4" style={{ marginLeft: "250px" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 ml-2">
        <h3 className="m-0 ">
          <Headset className="me-2" size={28} />
          Contact Us
        </h3>
        <div className="d-flex align-items-center">
          <PersonCircle size={35} className="text-primary me-2" />
          <div>
            <div className="text-muted small">Welcome Back</div>
            <div className="fw-bold">Admin</div>
          </div>
        </div>
      </div>

      <Row className="g-4">
        {/* Head Office Card */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <Building size={24} className="text-primary me-2" />
                <Card.Title className="m-0">Head Office</Card.Title>
              </div>
              <Card.Text>
                <div className="d-flex align-items-start mb-3">
                  <GeoAltFill size={18} className="text-muted me-2 mt-1" />
                  <div>
                    <strong>Address:</strong>
                    <br />
                    Plot No 97, Dakshinpurī - I, Shrikishan,
                    <br />
                    Sanganer, Jagatpura, Jajpur,
                    <br />
                    Rajasthan, India, 302017
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <TelephoneFill size={16} className="text-muted me-2" />
                  <div>
                    <strong>Phone:</strong> 0141-4511098
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <EnvelopeFill size={16} className="text-muted me-2" />
                  <div>
                    <strong>Email:</strong> info@7unique.in
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Globe2 size={16} className="text-muted me-2" />
                  <div>
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://www.7unique.in"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.sevenunique.com
                    </a>
                  </div>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Corporate Office Card */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <Building size={24} className="text-primary me-2" />
                <Card.Title className="m-0">Corporate Office</Card.Title>
              </div>
              <Card.Text>
                <div className="d-flex align-items-start mb-3">
                  <GeoAltFill size={18} className="text-muted me-2 mt-1" />
                  <div>
                    <strong>Address:</strong>
                    <br />
                    Office No. 101/2, 'Vakratunda Corporate Park
                    <br />
                    Premises Co-operative Society Limited,
                    <br />
                    Off. Aarey Road, Goregaon (East),
                    <br />
                    Mumbai - 400 063
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <TelephoneFill size={16} className="text-muted me-2" />
                  <div>
                    <strong>Phone:</strong> +91 0141-4511098
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <EnvelopeFill size={16} className="text-muted me-2" />
                  <div>
                    <strong>Email:</strong> support@7unique.in
                  </div>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Support Section */}
      {/* <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <Row>
                <Col md={8}>
                  <div className="d-flex align-items-center mb-3">
                    <ChatDotsFill size={24} className="text-primary me-2" />
                    <Card.Title className="m-0">Customer Support</Card.Title>
                  </div>
                  <Card.Text>
                    <div className="d-flex align-items-center mb-2">
                      <ClockFill size={16} className="text-muted me-2" />
                      <div>Monday to Saturday, 9:00 AM to 6:00 PM</div>
                    </div>
                    <p>
                      Our dedicated support team is ready to assist you with any
                      questions or concerns you may have.
                    </p>
                  </Card.Text>
                </Col>
                <Col
                  md={4}
                  className="d-flex align-items-center justify-content-end"
                >
                  <div>
                    <Button variant="primary" className="me-2">
                      <TelephoneFill className="me-2" />
                      Call Now
                    </Button>
                    <Button
                      variant="outline-primary"
                      href="mailto:support@7unique.in"
                    >
                      <EnvelopeFill className="me-2" />
                      Email Us
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      {/* Map Section */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              <div className="d-flex align-items-center p-3 border-bottom">
                <GeoAltFill size={20} className="text-primary me-2" />
                <h5 className="m-0">Our Location</h5>
                <Button
                  variant="link"
                  className="ms-auto"
                  href="https://maps.app.goo.gl/Kff3S5BFnL6R7XyVA"
                  target="_blank"
                >
                  <Link45deg className="me-1" />
                  Open in Google Maps
                </Button>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.2631829043708!2d75.86723457531065!3d26.799747364936287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc94baba6edad%3A0xd9cda1cfd0d224a!2sSevenUnique%20Tech%20Solutions%20Pvt.%20Ltd.%20%7C%20Web%20%26%20App%20Development.!5e0!3m2!1sen!2sin!4v1751095886152!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{border:0}}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              {/* src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.102370777536!2d75.78521431504396!3d26.84242498316079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5b0a0e9e8c5%3A0x1b9a3a3b3b3b3b3b!2s7Unique!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="400" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy"
                title="7Unique Location" */}
              {/* ></iframe> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactUsStatic;
