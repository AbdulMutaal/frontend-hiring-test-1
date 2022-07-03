import React from 'react';
import ReactModal from 'react-modal';
import styles from './modal.module.css';

export default function Modal(props) {
    return(
        <div>
            <ReactModal className={styles.Content} overlayClassName={styles.Overlay} isOpen={props.showModal} style={{overlay: {backgroundColor: 'rgba(229, 299, 299, 0.75', margin: 'auto', zIndex: '9999'}}}>
                <div>
                   {props.children}
                </div>
            </ReactModal>
        </div>
    )
}