import React from 'react'
import { EventCard } from "./EventCard";

export const EventDashboard = (props) => {
  return (
    <>
      {
        props.events.map(event => {
          return (
            <>
              <EventCard event={event} userId={props.userId} />
            </>
          )
        })
      };
    </>
  )
}
