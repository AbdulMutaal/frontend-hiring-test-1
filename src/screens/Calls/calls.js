import React, { useState, useEffect } from 'react';
import axios from 'axios'

import CallsTable from "../../components/Calls/CallsTable/callsTable";
import Modal from '../../components/Calls/Modal/modal';
import CallDetailModal from '../../components/Calls/CallDetail/CallDetail';
import styles from './calls.module.css';

export default function Calls() {
    const [ calls, setCalls ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ showCallDetailModal, setShowCallDetailModal ] = useState(false);
    const [ callDetail, setCallDetail ] = useState(null);
    const [ note, setNote ] = useState('');
    const [ totalPages, setTotalPages ] = useState(1);
    const [ callsLoading, setCallsLoading ] = useState(true);
    const [ callsDetailLoading, setCallsDetailLoading ] = useState(true);
    const [ archiveSuccess, setArchiveSuccess ] = useState(false);
    const [ addNoteSuccess, setAddNoteSuccess ] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem('token');
        console.log("Token");
        console.log(token);

        if((!token) || token === 'null') {
            getToken();
            token = localStorage.getItem('token');
            getCalls(token, 1);

        }
        else {    
            RefreshToken(token); 
            getCalls(token, 1);
        }
     // eslint-disable-next-line
    }, [])

    function onPageChange(event: React.ChangeEvent<unknown>, page: number) {
        let token = localStorage.getItem('token');
        setCallsLoading(true);
        setCalls([]);

        if((!token) || token === 'null') {
            getToken();

            token = localStorage.getItem('token');

            setCurrentPage(page);     
            getCalls(token, 10*(page-1));
        }
        else { 
            setCurrentPage(page);     
            getCalls(token, 10*(page-1));
        }
    }

    async function getToken() {
        let postData = {};
        postData.username = 'AbdulMutaal';
        postData.password = 'Password'

        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, postData)
        .then((response) => {
            console.log(response);
            if(response && response.data && response.data.access_token) {
                console.log("DFS");
                localStorage.setItem('token', response.data.access_token);
            }
        })
    }

    function getCalls(token, offset) {
        console.log(token);
        console.log(offset);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/calls?offset=${offset}&limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {

            if(response && response.data && response.data.nodes) {
                setCalls(response.data.nodes);
                setCallsLoading(false);
                setTotalPages(Math.ceil(response.data.totalCount/10));
            }
        })
        .catch((error) => {

            if(error && error.response && error.response.data && error.response.data.statusCode === 401) {
                alert("Token has expired. Please refresh the page");
            }
            else if(error && error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            }
            else {
                alert("Something went wrong");
            }
            setCallsLoading(false);
        })
    }

    function getSingleCall(token, callId) {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/calls/${callId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {

            if(response && response.data) {
                setCallDetail(response.data);
                setCallsDetailLoading(false);
            }
        })
        .catch((error) => {

            if(error && error.response && error.response.data && error.response.data.statusCode === 401) {
                alert("Token has expired. Please refresh the page");
            }
            else if(error && error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            }
            else {
                alert("Something went wrong");
            }
            setCallsDetailLoading(false);
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

            let call1 = {...callDetail};
            if(response && response.data) {
                call1.is_archived = response.data.is_archived;
                setCallDetail(call1);
                setAddNoteSuccess(false);
                setArchiveSuccess(true);
            }
            
        })
        .catch((error) => {

            if(error && error.response && error.response.data && error.response.data.statusCode === 401) {
                alert("Token has expired. Please refresh the page");
            }
            else if(error && error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            }
            else {
                alert("Something went wrong");
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

            if(response && response.data) {
                let callD = {...callDetail};
                callD.notes = response.data.notes;
                setCallDetail(callD);
                setNote('');
                setArchiveSuccess(false);
                setAddNoteSuccess(true);
            }
            
        })
        .catch((error) => {

            if(error && error.response && error.response.data && error.response.data.statusCode === 401) {
                alert("Token has expired. Please refresh the page");
            }
            else if(error && error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            }
            else {
                alert("Something went wrong");
            }
        })
    }

    function CallDetail(callId) {
        setShowCallDetailModal(true);

        let token = localStorage.getItem('token');

        if((!token) || token === 'null') {
            getToken();
            token = localStorage.getItem('token');
            getSingleCall(token, callId);
        }
        else { 
            getSingleCall(token, callId);
        }
    }

    function CloseCallDetail() {
        setShowCallDetailModal(false);
    }

    function onArchive(id) {
        let token = localStorage.getItem('token');

        if((!token) || token === 'null') {
            getToken();

            token = localStorage.getItem('token');
            ArchiveCall(token, id);
        }
        else { 
            ArchiveCall(token, id);
        }       
    }

    function onNoteChange(e) {
        setNote(e.target.value);
    }

    function onAddNote(id) {
        let token = localStorage.getItem('token');
        let postData = {};
        postData.content = note;

        if((!token) || token === 'null') {
            getToken();
            token = localStorage.getItem('token');

            AddNote(token, id, postData);
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

        setCalls(grouped_calls);
    }

    async function RefreshToken(token) {
        
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh-token`, {}, {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response && response.data && response.data.access_token) {
                localStorage.setItem("token", response.data.access_token);
            }
        })

    }

    return(
        <div className={styles.MainDiv}>
            <h3 className={styles.CallsHeading}>Calls</h3>
            <CallsTable calls={calls} onPageChange={onPageChange} page={currentPage} CallDetail={CallDetail} GroupByDate={GroupByDate} totalPages={totalPages} callsLoading={callsLoading} />
            
            <Modal showModal={showCallDetailModal}>
                <CallDetailModal callDetail={callDetail} Close={CloseCallDetail} onArchive={onArchive} note={note} onNoteChange={onNoteChange} onAddNote={onAddNote} callsDetailLoading={callsDetailLoading} archiveSuccess={archiveSuccess} setArchiveSuccess={setArchiveSuccess} addNoteSuccess={addNoteSuccess} setAddNoteSuccess={setAddNoteSuccess} />
            </Modal>
        </div>
    );
}