import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Pagination from '../Pagination/pagination';
import styles from './callsTable.module.css';

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
    let seconds = t/1000;

    return(
        <p>{seconds} s</p>
    );

}

export default function CallsTable(props) {

  // ...render your table
  return(
    <>  
        <div className={styles.TableCont}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{position: 'sticky', top: '0', background: 'white'}}>
                        <TableRow>
                            <TableCell className={styles.TableRow}>ID</TableCell>
                            <TableCell style={{cursor: 'pointer'}} className={styles.TableRow} align="center" onClick={props.GroupByDate}>Created At</TableCell>
                            <TableCell className={styles.TableRow} align="center">From</TableCell>
                            <TableCell className={styles.TableRow} align="center">To</TableCell>
                            <TableCell className={styles.TableRow} align="center">Duration</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                    {props.calls && props.calls.map((call, i) => (
                        <TableRow
                        key={call.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        className={styles.RowTable}
                        onClick={() => props.CallDetail(call.id)}
                        >
                        <TableCell component="th" scope="row">
                            {call.id}
                        </TableCell>
                        <TableCell align="center"><CreatedAt date={call.created_at} /></TableCell>
                        <TableCell align="center">{call.from}</TableCell>
                        <TableCell align="center">{call.to}</TableCell>
                        <TableCell align="center"><Duration time={call.duration} /></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        
        <div style={{marginTop: '10px'}}>
            <Pagination onPageChange={props.onPageChange} page={props.page} totalPages={props.totalPages}/>
        </div>
        
    </>
   
            
  );
}