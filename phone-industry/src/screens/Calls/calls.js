import React, { useState, useEffect } from 'react';
import axios from 'axios'

import CallsTable from "../../components/Calls/CallsTable/callsTable";
import Modal from '../../components/Calls/Modal/modal';
import CallDetailModal from '../../components/Calls/CallDetail/CallDetail';
import styles from './calls.module.css';

export default function Calls() {
    const [calls, setCalls ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ showCallDetailModal, setShowCallDetailModal ] = useState(false);
    const [ callDetail, setCallDetail ] = useState(null);
    const [ note, setNote ] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token");
        console.log(token);

        if((!token) || token === 'null') {
            getToken();
        }
        else {      
            getCalls(token, 1);
        }
    
    }, [])

    function onPageChange(event: React.ChangeEvent<unknown>, page: number) {
        const token = localStorage.getItem('token');

        if((!token) || token === 'null') {
            getToken();
        }
        else { 
            setCurrentPage(page);     
            getCalls(token, 10*page);
        }
    }

    function getToken() {
        let postData = {};
        postData.username = 'AbdulMutaal';
        postData.password = 'Password'

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, postData)
        .then((response) => {
            if(response && response.data && response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
            }
        })
    }

    function getCalls(token, offset) {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/calls?offset=${offset}&limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log("CAlls");
            console.log(response);

            if(response && response.data && response.data.nodes) {
                setCalls(response.data.nodes);
            }
        })
        .catch((error) => {
            console.log("ERROR");
            console.log(error.response);

            if(error && error.response && error.response.data && error.response.data.statusCode === 401) {
                localStorage.setItem('token', null);
            }
        })
    }

    function getSingleCall(token, callId) {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/calls/${callId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log("CAll");
            console.log(response);

            if(response && response.data) {
                setCallDetail(response.data);
            }
        })
        .catch((error) => {
            console.log("ERROR");
            console.log(error.response);

            if(error && error.response && error.response.data && error.response.data.statusCode === 401) {
                localStorage.setItem('token', null);
            }
        })
    }

    function ArchiveCall(token, id) {
        let postData = '';
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/calls/${id}/archive`, postData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log('Archived');
            console.log(response);
            let call1 = {...callDetail};
            if(response && response.data) {
                call1.is_archived = response.data.is_archived;
                setCallDetail(call1);
            }
            
        })
    }

    function AddNote(token, id, data) {
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/calls/${id}/note`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log('Note');
            console.log(response);

            if(response && response.data) {
                let callD = {...callDetail};
                callD.notes = response.data.notes;
                setCallDetail(callD);
                setNote('');
            }
            
        })
    }

    function CallDetail(callId) {
        setShowCallDetailModal(true);

        const token = localStorage.getItem('token');

        if((!token) || token === 'null') {
            getToken();
        }
        else { 
            getSingleCall(token, callId);
        }
    }

    function CloseCallDetail() {
        setShowCallDetailModal(false);
    }

    function onArchive(id) {
        const token = localStorage.getItem('token');

        if((!token) || token === 'null') {
            getToken();
        }
        else { 
            ArchiveCall(token, id);
        }       
    }

    function onNoteChange(e) {
        // console.log("ON note change");
        // console.log(e.target.value);
        setNote(e.target.value);
    }

    function onAddNote(id) {
        const token = localStorage.getItem('token');
        let postData = {};
        postData.content = note;

        if((!token) || token === 'null') {
            getToken();
        }
        else { 
            AddNote(token, id, postData);
        }
    }

    function GroupByDate() {
        var callss = [...calls];
        
        var grouped_calls = callss.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at)
        }).reverse();

        console.log("GROUO");
        console.log(grouped_calls);
        setCalls(grouped_calls);
    }

    return(
        <div style={{padding: '50px'}}>
            <h3 className={styles.CallsHeading}>Calls</h3>
            <CallsTable calls={calls} onPageChange={onPageChange} page={currentPage} CallDetail={CallDetail} GroupByDate={GroupByDate} />
            
            <Modal showModal={showCallDetailModal}>
                <CallDetailModal callDetail={callDetail} Close={CloseCallDetail} onArchive={onArchive} note={note} onNoteChange={onNoteChange} onAddNote={onAddNote} />
            </Modal>
        </div>
    );
}