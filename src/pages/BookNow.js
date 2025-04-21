import { message, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import SeatSelection from '../components/SeatSelection';
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import StripeCheckout from 'react-stripe-checkout';


function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { user } = useSelector((state) => state.users);
  const params = useParams();
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const getBus = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/buses/get-bus-by-id`, {
        _id: params.id
      });
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const bookNow =
    async ({transactionId}) => {
      try {
        dispatch(ShowLoading());
        const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/bookings/book-seat`, {
          bus: bus._id,
          seats: selectedSeats,
          transactionId
        });
        dispatch(HideLoading());
        if (response.data.success) {
          message.success(response.data.message);
          navigate("/bookings");
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);

      }
    };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/bookings/make-payment`, {
        token,
        amount: selectedSeats.length * bus.fare *100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      }
      else {
        message.error(response.data.message);
      }

    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };


  const handleRazorpayPayment = async () => {
    try {
      dispatch(ShowLoading());
      const amount = selectedSeats.length * bus.fare;

      // 1. Create Razorpay order from backend
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/bookings/create-order`, { amount });

      dispatch(HideLoading());

      const options = {
        key: "rzp_test_2f1TxXgOTHmK3A", // Replace with your actual Razorpay key_id
        amount: response.data.amount,
        currency: "INR",
        name: "Bus Booking",
        description: `Booking seats: ${selectedSeats.join(", ")}`,
        order_id: response.data.id,
        handler: async function (response) {
          message.success("Payment successful!");
          bookNow(response.razorpay_payment_id);
        },
        prefill: {
          name: user?.name || "man",
          email: user?.email || "man2134@gmail.com",
          contact: user?.phone || "8877665544"
        },
        theme: {
          color: "#528FF0"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadRazorpayScript();
    getBus();
  }, []);



  useEffect(() => {
    getBus();
  }, []);
  return (
    <div>
      {bus && (
        <Row className='mt-3' gutter={[30,30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className='text-2xl primary-text'>{bus.name}</h1>
            <h1 className='text-md'>{bus.from} - {bus.to}</h1>

            <hr />

            <div className='flex flex-col gap-2'>
              <p className='text-md'>Journey Date:{bus.journeyDate}</p>
              <p className='text-md'>Fare: Rs.{bus.fare}</p>
              <p className='text-md'>Departure Time: {bus.departure}</p>
              <p className='text-md'>Arrival Time: {bus.arrival}</p>
              <p className='text-md'>Capacity: {bus.capacity}</p>
              <p className='text-md'>Seats Left: {bus.capacity - bus.seatsBooked.length}</p>
            </div>
            <hr />

            <div className='flex flex-col gap-2'>
              <h1 className='text-xl'>
                Selected Seats:  {selectedSeats.join(",")}
              </h1>
              <h1 className='text-xl mt-2'>Fare : ${bus.fare * selectedSeats.length}</h1>
              <hr />
              <button
                className={`primary-btn ${selectedSeats.length === 0 && "disabled-btn"}`}
                disabled={selectedSeats.length === 0}
                onClick={handleRazorpayPayment}
              >
                Book Now
              </button>
              {/* <StripeCheckout
              billingAddress
                token={onToken}
                amount = {bus.fare * selectedSeats.length *100}
                //currency="USD"
                stripeKey="pk_test_51MmrYuG9CpQj2gcvdDd38G7tiYKjFb0nhPtMO1X8UEcoz4xzxCmLhn6UtSR4ZLc4xXmsMgc6zZaznkg9wouTV3RC00yEdys6DY"
              >
                <button
                  className={`primary-btn ${selectedSeats.length === 0 && "disabled-btn"
                    }`}
                  disabled={selectedSeats.length === 0}
                >Book Now</button>
              </StripeCheckout> */}


            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  )
}

export default BookNow
