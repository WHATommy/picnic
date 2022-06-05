import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import tripService from '../../../../../services/tripService';

import { loadSearchResult } from '../../../../../slices/search';
import { loadTrip } from '../../../../../slices/trip'

export const SearchUser = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const searchResult = useSelector((state) => state.search);
    let pendingUsers = useSelector((state) => state.trip.pendingUsers);
    pendingUsers = Object.values(pendingUsers);
    const contents = useSelector((state) => state.content.content);
    const attendees = contents.map(content => content._id);
    const tripId = useSelector((state) => state.trip._id)

    useEffect(() => {
        dispatch(loadTrip({tripId}));
    },[dispatch, tripId])


    const onChange = (e) => {
        const regex = /^[a-z0-9]+$/i;
        if(e.target.value.toLowerCase() === "" || regex.test(e.target.value.toLowerCase())) {
            setSearchValue(e.target.value);
            dispatch(loadSearchResult({ value: e.target.value.toLowerCase() }));
        }
    };

    const handleInvite = async (e) => {
        setLoading(true);
        await tripService.inviteUser(tripId, e.target.value);
        dispatch(loadTrip({tripId}));
        setLoading(false)
    }

    return (
        <div>
            <form>
                <input
                    type="text" 
                    class="form-control" 
                    id="searchUser" 
                    value={searchValue}
                    onChange={onChange}
                />
            </form>
            {(searchResult.users && searchValue) && 
                <ul className="list-group mt-3">
                    {
                        (!(searchResult.loading)) ? 
                            searchResult.users.map(user => {
                                return (
                                    <li className="row m-3 border secondary-bordery rounded">
                                        <div className="col-md-6 col-12 pt-2 text-center">
                                            <img className="rounded mt-2 border secondary-border" src={user.profilePic.image} width={70} height={70} alt={user.username} />
                                            <p>{user.username}</p>
                                        </div>
                                        {
                                            (pendingUsers.includes(user._id)) ?
                                            <div className="col-md-6 col-12 pt-md-4 pt-0 mt-2 mb-2 text-center">
                                                <button className="btn btn-secondary" disabled>
                                                    Invited
                                                </button>
                                            </div>
                                            :
                                            (attendees.includes(user._id)) ?
                                            <div className="col-md-6 col-12 pt-md-4 pt-0 mt-2 mb-2 text-center">
                                                <button className="btn btn-success" disabled>
                                                    Accepted
                                                </button>
                                            </div>
                                            :
                                            <div className="col-md-6 col-12 pt-md-4 pt-0 mt-2 mb-2 text-center">
                                                <button className="btn btn-outline-primary" value={user._id} onClick={handleInvite}>
                                                    {loading &&
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                    }
                                                    Invite
                                                </button>
                                            </div>
                                        }
                                    </li>
                                )
                            })
                        :
                            <span className="spinner-border"></span>
                    }
                </ul>
            }
        </div>
    )
}
