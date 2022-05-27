import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TripIcons } from './TripIcons';


export const Sidebar = (props) => {
  // State for window size
  const mediaMatch = window.matchMedia('(min-width: 576px)');
  const [matches, setMatches] = useState(mediaMatch.matches);

  useEffect(() => {
    const handler = e => setMatches(e.matches);
    mediaMatch.addEventListener("change", handler);
    return () => mediaMatch.removeEventListener("change", handler);
  });

  return (
    <div className="container-fluid">
        <div className="row">
            <div className="col-sm-auto bg-light overflow-auto d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top" style={styles(matches)}>
              <a href="/"><i className="m-2 bi bi-cloud" style={{fontSize: "50px"}}></i></a>
              {
                props ? 
                  props.trips.map(trip => {
                    return (
                      <TripIcons tripIcon={trip.icon.image} tripName={trip.name}/>
                    );
                  })
                :
                <></>
              }
            </div>
            <div className="col-sm p-3 min-vh-100">
            </div>
        </div>
    </div>
  )
}

const styles = (isMobile) => {
  return isMobile ? {height: "100vh"} : null
}
