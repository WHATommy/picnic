import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";

import { loadSearchResult } from '../../../../../slices/search';

export const SearchUser = () => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");

    const searchResult = useSelector((state) => state.search);

    const onChange = (e) => {

        const regex = /^[a-z0-9]+$/i;
        if(e.target.value.toLowerCase() === "" || regex.test(e.target.value.toLowerCase())) {
            setSearchValue(e.target.value);
            dispatch(loadSearchResult({ value: e.target.value.toLowerCase() }));
        }
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
                    {console.log(searchResult.users, searchResult.loading)}
                    {
                        (!(searchResult.loading)) ? 
                            searchResult.users.map(user => {
                                return (
                                    <li className="list-group-item">
                                        <img className="rounded mt-2 border secondary-border" src={user.profilePic.image} width={70} height={70} alt={user.username} />
                                        <p>{user.username}</p>
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
