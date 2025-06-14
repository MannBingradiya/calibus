import { message, Modal, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import BusForm from '../../components/BusForm'
import PageTitle from '../../components/PageTitle'
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import moment from 'moment';
import {useReactToPrint, usereactToPrint} from 'react-to-print';

function AdminBookings() {
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();

    const [users, setUsers] = useState([]); // return users from backend
  

    const getBookings = async() =>{
        try{
          dispatch(ShowLoading());
          const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/bookings/get-all-bookings`, {});
          dispatch(HideLoading());
          if(response.data.success){
            const mappedData = response.data.data.map((booking) =>{
                return{
                    ...booking,
                    ...booking.bus,
                    ...booking.user,
                    key: booking._id,
                };
            });
            setBookings(mappedData);
          }else{
            message.error(response.data.message);
          }
        } catch(error){
          dispatch(HideLoading());
          message.error(error.message);
        }
      };

    const columns = [
        
        {
            title: "User Name",
            dataIndex: "name",
            key:"user",
        },
        {
            title: "Bus Number",
            dataIndex: "number",
            key:"bus",
        },
        {
            title: "Journey Date",
            dataIndex: "journeyDate",
        },
        {
            title: "Journey Time",
            dataIndex: "departure",
        },
        {
            title: "Seats",
            dataIndex: "seats",
            render:(seats) => {
              return seats.join(",");
            },
        },
        {
            title:"Action",
            dataIndex:"action",
            render:(text, record)=>(
                <div>
                    <p className='text-md underline' 
                    onClick={()=>{
                        setSelectedBooking(record);
                        setShowPrintModal(true);
                    }}
                        >Print Ticket</p>
                </div>
            ),
        },

    ];



    useEffect(()=>{
        getBookings();
      }, []);

      const componentRef = useRef();
      const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      })
  return (
    <div>
      <PageTitle title="AdminBookings" />
      <div className='mt-2'>
      <Table dataSource={bookings} columns ={columns}/>
      </div>
      {showPrintModal && <Modal title='Print Ticket'
      onCancel={
        () => {
            setShowPrintModal(false);
            setSelectedBooking(null);

        }}
        visible = {showPrintModal}
        okText = "print"
        onOk = {handlePrint}
      
      >
        <div className='d-flex flex-column p-5' ref ={componentRef}>
        <p>Bus: {selectedBooking.name}</p>
        <p>{selectedBooking.from}-{selectedBooking.to}</p>
        <hr/>
        <p>
            <span>Journey date:</span>{" "}
            {moment(selectedBooking.journeyDate).format("DD-MM-YYYY")}
        </p>
        <p>
            <span>Journey Time:</span>{" "}
            {selectedBooking.departure}
        </p>
        <hr />
        <p>
        <span>Seat numbers:</span>{" "} <br/>
            {selectedBooking.seats}
            </p>
        <hr />
        <p>
        <span>Total Amount:</span>{" "}
            {selectedBooking.fare*selectedBooking.seats.length}$
        </p>
        </div>
        
      </Modal>}
    </div>
  );
}

export default AdminBookings
