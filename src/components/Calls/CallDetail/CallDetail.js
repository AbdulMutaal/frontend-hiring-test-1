import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import styles from './CallDetail.module.css';

function CreatedAt({date}) {
    let d = '';
    if(date) {
        d = date.split('T')[0];
    }
    else {
        d = null
    }
    

    return(
        <p>{d}</p>
    )
}

function Duration({time}) {
    
    let t = time;
    let seconds;

    if(t) {
        seconds = t/1000;
    }
    else {
        seconds= null;
    }

    return(
        <p>{seconds} s</p>
    );

}


export default function CallDetail(props) {
    const call = props.callDetail;
    return(
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h1 className={styles.CallDetailHeading}>Call Detail</h1>
                <CloseIcon className={styles.CloseIcon} onClick={props.Close}/>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{position: 'sticky', top: '0', background: 'white'}}>
                        <TableRow>
                            <TableCell className={styles.TableRow} align="center">Call Type</TableCell>
                            <TableCell className={styles.TableRow} align="center">Created At</TableCell>
                            <TableCell className={styles.TableRow} align="center">Direction</TableCell>
                            <TableCell className={styles.TableRow} align="center">Duration</TableCell>
                            <TableCell className={styles.TableRow} align="center">Called From</TableCell>
                            <TableCell className={styles.TableRow} align="center">ID</TableCell>
                            <TableCell className={styles.TableRow} align="center">Archived ?</TableCell>
                            <TableCell className={styles.TableRow} align="center">Notes</TableCell>
                            <TableCell className={styles.TableRow} align="center">Called To</TableCell>
                            <TableCell className={styles.TableRow} align="center">Via</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            className={styles.RowTable}
                        >
                        <TableCell component="th" scope="row"  className={styles.TableRowValue}>
                            <p>{props.callDetail ? props.callDetail.call_type : ''}</p>
                        </TableCell>
                        <TableCell className={styles.TableRowValue} align="center"><CreatedAt date={call ? call.created_at : null} /></TableCell>
                        <TableCell className={styles.TableRowValue} align="center"><p>{call ? call.direction : ''}</p></TableCell>
                        <TableCell className={styles.TableRowValue} align="center"><p><Duration time={call ? call.duration : null} /></p></TableCell>
                        <TableCell className={styles.TableRowValue} align="center"><p>{call ? call.from : ''}</p></TableCell>
                        <TableCell className={styles.TableRowValue} align="center"><p>{call ? call.id : ''}</p></TableCell>
                        <TableCell className={styles.TableRowValue} align="center"><p>{call ? (call.is_archived ? 'true' : 'false') : ''}</p></TableCell>
                        <TableCell className={styles.TableRowValue} align="center"><p>{call && call.notes && call.notes.map((note) => {
                                return(
                                    <div style={{marginTop: '20px'}}>
                                        {note.content}
                                    </div>
                                );
                            })}</p>
                        </TableCell>

                        <TableCell className={styles.TableRowValue} align="center"><p>{call ? call.to : ''}</p></TableCell>
                        <TableCell className={styles.TableRowValue} align="center"><p>{call ? call.via : ''}</p></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <textarea className={styles.TextArea} onChange={props.onNoteChange} value={props.note}></textarea>
            <button className={styles.ArchiveBtn} onClick={() => props.onAddNote(call.id)}>Add Note</button>

            <button className={styles.ArchiveBtn} onClick={() => props.onArchive(call.id)}>Archive Call</button>
            
        </div>
    );
}