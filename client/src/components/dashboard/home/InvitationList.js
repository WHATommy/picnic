import React, {useEffect, useState} from 'react';
import { useDispatch } from "react-redux";
import inviteService from '../../../services/inviteService';
import { loadUser } from '../../../slices/user';

export const InvitationList = (props) => {
    const dispatch = useDispatch();

    // State for window size
    const mediaMatch = window.matchMedia('(min-width: 991px)');
    const [matches, setMatches] = useState(mediaMatch.matches);
    useEffect(() => {
        const handler = e => setMatches(e.matches);
        mediaMatch.addEventListener("change", handler);
        return () => mediaMatch.removeEventListener("change", handler);
    });

    const handleAccept = async (e) => {
        await inviteService.accept(e.target.value);
        await dispatch(loadUser({}));
    }
    const handleDecline = async (e) => {
        await inviteService.decline(e.target.value);
        await dispatch(loadUser({}));
    }
    return (
        <div>
            <h2>Invitations</h2>
            <hr />
            <ul className="list-group">
                {props.invitations &&
                    props.invitations.map(invite => {
                        const startDate = new Date(invite.startDate).toLocaleDateString(
                            'en-US',
                            {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                            }
                        );
                        const endDate = new Date(invite.endDate).toLocaleDateString(
                            'en-gb',
                            {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                            }
                        );
                        const startTime = Intl.DateTimeFormat('en', { hour: "numeric", minute: "numeric", hour12: true } ).format(new Date(invite.startDate))
                        const endTime = Intl.DateTimeFormat('en', { hour: "numeric", minute: "numeric", hour12: true } ).format(new Date(invite.endDate))
                        const [, endTzName] = /.*\s(.+)/.exec((new Date(invite.endDate)).toLocaleDateString(navigator.language, { timeZoneName: 'short' }));
                        return (
                            <li className="list-group-item d-flex flex-row flex-nowrap overflow-auto" key={invite._id}>
                                <div className="align-middle">
                                    <img className="rounded mt-2 border secondary-border" src={invite.icon.image} width={70} height={70} alt={invite.icon.image} />
                                </div>
                                <div className="ms-2 container-fluid">
                                    <div className="row">
                                        <div className="col-lg-3">
                                        <i class="bi bi-card-text primary"></i> {invite.name}
                                        </div>
                                        <div className="col-lg-7">
                                            <i class="bi bi-calendar-check-fill primary"></i> {startDate} {startTime} - {endDate} {endTime} {endTzName}
                                        </div>
                                        <div className="col-lg-2 col-12 text-end">
                                            {matches && <button className="btn btn-success" value={invite._id} onClick={handleAccept}>Accept</button>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <i class="bi bi-geo-alt-fill primary"></i> {invite.location}
                                        </div>
                                        <div className="col-lg-7">
                                            <i class="bi bi-piggy-bank-fill primary"></i> ${invite.cost}
                                        </div>
                                        <div className="col-lg-2 col-12 text-end">
                                            {!matches && <button className="btn btn-success me-1" value={invite._id} onClick={handleAccept}>Accept</button>}
                                            <button className="btn btn-danger" value={invite._id} onClick={handleDecline}>Decline</button>
                                        </div>
                                    </div>
                                </div>
                                
                            </li>
                        )
                    })
                }
            </ul>
        </div>
        
    )
}
