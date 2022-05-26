import React, { useState, useEffect } from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
export const Sidebar = () => {
  const mediaMatch = window.matchMedia('(min-width: 576px)');
  const [matches, setMatches] = useState(mediaMatch.matches);

  useEffect(() => {
    const handler = e => setMatches(e.matches);
    mediaMatch.addEventListener("change", handler);
    return () => mediaMatch.removeEventListener("change", handler);
  });

  const renderTooltip = props => (
    <Tooltip {...props}>Tooltip for the register button</Tooltip>
  );

  return (
    <div className="container-fluid">
        <div className="row">
            <div className="col-sm-auto bg-light overflow-auto d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top" style={styles(matches)}>
              <a href="/"><i className="m-2 bi bi-cloud" style={{fontSize: "50px"}}></i></a>
              <OverlayTrigger placement="right" overlay={(renderTooltip)}>
                <button type="button" className="btn btn-secondary p-0">
                  <img className="rounded" src="https://res.cloudinary.com/dkf1fcytw/image/upload/v1652909553/cursedTommy_lkgwcn.png" height="70" width="70" alt="tommy" />
                </button>
              </OverlayTrigger>
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
