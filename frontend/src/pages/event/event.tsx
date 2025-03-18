import { useEffect, useState } from "react";
import EventModal from "./event-modal";
import useCreateEvent, { IEvents } from "./services/create-event/create-event";
import useGetAllEvents from "./services/get-all-events/get-all-events";
import useJoinEvent from "./services/join-event/join-event";
import { toast } from "react-toastify";
import { useUser } from "../../context/user-context";
import EventDetails from "./event-details";
import { useParams } from "react-router-dom";

// interface IEvent {
//   id: string;
//   name: string;
//   description: string;
//   location: string;
//   date: string;
//   time: string;
//   endTime: string;
//   participants: string[];
//   isPaid: boolean;
//   price: number;
//   host: string;
//   hostDescription?: string;
// }
const Event = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEventDetails, setIsEventDetails] = useState<any>({
    data: {},
    isDetails: false,
  });
  const { organizationId } = useParams<{ organizationId: string }>();
  const [previousEvents, setPreviousEvents] = useState<IEvents[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvents[]>([]);
  const createEvent = useCreateEvent(organizationId);
  const getAllEvents = useGetAllEvents(organizationId);
  const joinEvent = useJoinEvent();
  const { user } = useUser();
  const handleCreateEvent = (eventData: any) => {
    // Calculate end time
    const [hours, minutes] = eventData.time.split(":").map(Number);
    const endHours = hours + eventData.duration;
    const endTimeStr = `${endHours % 24}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      endTime: endTimeStr,
      participants: [],
    };
    createEvent.mutate(newEvent);
  };

  const handleJoinEvent = (id: string) => {
    joinEvent.mutate(id);
  };

  const handleClick = (event: any) => {
    setIsEventDetails({ data: event, isDetails: true });
  };

  useEffect(() => {
    if (getAllEvents.isSuccess && getAllEvents.data) {
      console.log(getAllEvents, "getAllEvents");
      setPreviousEvents(getAllEvents.data.previousEvents);
      setUpcomingEvents(getAllEvents.data.upcomingEvents);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllEvents.isSuccess && getAllEvents.data]);

  useEffect(() => {
    if (createEvent.isSuccess && createEvent.data) {
      getAllEvents.refetch();
      toast.success("Event created successfully!");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createEvent.isSuccess && createEvent.data]);

  useEffect(() => {
    if (joinEvent.isSuccess && joinEvent.data) {
      getAllEvents.refetch();
      toast.success("You've successfully joined the event!");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinEvent.isSuccess && joinEvent.data]);

  return (
    <>
      {isEventDetails.isDetails ? (
        <EventDetails
          event={isEventDetails}
          setIsEventDetails={setIsEventDetails}
        />
      ) : (
        <div className="min-h-screen bg-[#F5F7FA] p-8">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h1 className="font-playfair font-bold text-4xl text-[#2C3E50]">
                Events
              </h1>
              {user && user.role === "admin" && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  title="Click to create event"
                  className="bg-[#16A085] hover:bg-[#457067] text-[#ffffff] font-montserrat font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create New Event
                </button>
              )}
            </div>
            {previousEvents &&
            previousEvents?.length === 0 &&
            upcomingEvents &&
            upcomingEvents?.length === 0 ? (
              <div className="border-2 rounded-xl flex flex-col items-center justify-center py-10">
                <svg
                  className="w-16 h-16 text-black/20 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-black/60 font-montserrat text-lg">
                  No Previous and Upcoming Events right now
                </p>
                <p className="text-black/40 font-montserrat text-sm mt-2">
                  New Events will appear here when scheduled
                </p>
              </div>
            ) : (
              <>
                <section className="mb-16">
                  <h2 className="font-playfair font-bold text-2xl mb-8 text-[#2c5049]">
                    Previous Events
                  </h2>
                  {previousEvents && previousEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                      {previousEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() =>
                            user?.role === "admin" && handleClick(event)
                          }
                          className={`${
                            user && user.role !== "client"
                              ? "cursor-pointer"
                              : ""
                          } bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                          title={
                            user && user.role !== "client"
                              ? "Click to view Event Details"
                              : ""
                          }
                        >
                          <div className="mb-4 overflow-hidden rounded-xl">
                            <img
                              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3"
                              alt="Workshop"
                              className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-playfair font-bold text-xl text-[#2C3E50] hover:text-[#64B5F6] transition-colors duration-300">
                              {event.name}
                            </h3>
                            <div className="flex items-center gap-1 group">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#656564] group-hover:text-[#64B5F6] transition-colors duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <span className="font-montserrat text-[#656564] group-hover:text-[#64B5F6] transition-colors duration-300">
                                {event.participants.length} Participants
                              </span>
                            </div>
                          </div>
                          <p className="font-montserrat text-[#34495E] mb-4">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-2 mb-4 group">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#FF7675] group-hover:text-[#64B5F6] transition-colors duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-montserrat text-[#34495E] group-hover:text-[#64B5F6] transition-colors duration-300">
                              {event.time} ({event.duration} hours)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 group">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#74B9FF] group-hover:text-[#64B5F6] transition-colors duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="font-montserrat text-[#34495E] group-hover:text-[#64B5F6] transition-colors duration-300">
                              {event.location}
                            </span>
                          </div>
                          {event.isPaid && (
                            <div className="flex items-center gap-2 mt-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#F1C40F]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-montserrat font-bold text-[#34495E]">
                                ${event.price.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {(event.host || event.hostDescription) && (
                            <>
                              <hr className="m-4" />
                              <p>Host Info:</p>
                              {event.host && (
                                <div className="flex items-center gap-2 mt-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 text-[#239c25]"
                                  >
                                    <path
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.5"
                                      d="M19.618 21.25c0-3.602-4.016-6.53-7.618-6.53s-7.618 2.928-7.618 6.53M12 11.456a4.353 4.353 0 1 0 0-8.706a4.353 4.353 0 0 0 0 8.706"
                                    />
                                  </svg>
                                  <p className="font-montserrat text-[#34495E]">
                                    {event.host}
                                  </p>
                                </div>
                              )}
                              {event.hostDescription && (
                                <div className="flex items-center gap-2 mt-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    className="h-5 w-5 text-[#3f3dcf]"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M2.5 5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1zM2 11.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1z"
                                    />
                                  </svg>
                                  <p className="font-montserrat text-[#34495E]">
                                    {event.hostDescription}
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 flex flex-col items-center justify-center py-10">
                      <svg
                        className="w-16 h-16 text-black/20 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-black/60 font-montserrat text-lg">
                        No Previous Event right now
                      </p>
                      <p className="text-black/40 font-montserrat text-sm mt-2">
                        New Event will appear here when scheduled
                      </p>
                    </div>
                  )}
                </section>

                <section className="mb-16">
                  <h2 className="font-playfair font-bold text-2xl mb-8 text-[#2c5049]">
                    Upcoming Events
                  </h2>
                  {upcomingEvents && upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() =>
                            user?.role === "admin" && handleClick(event)
                          }
                          className="cursor-pointer bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                          title="Click to view Event Details"
                        >
                          <div className="mb-4 overflow-hidden rounded-xl">
                            <img
                              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3"
                              alt="Workshop"
                              className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-playfair font-bold text-xl text-[#2C3E50] hover:text-[#64B5F6] transition-colors duration-300">
                              {event.name}
                            </h3>
                            <div className="flex items-center gap-1 group">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#656564] group-hover:text-[#64B5F6] transition-colors duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <span className="font-montserrat text-[#656564] group-hover:text-[#64B5F6] transition-colors duration-300">
                                {event.participants.length} Participants
                              </span>
                            </div>
                          </div>
                          <p className="font-montserrat text-[#34495E] mb-4">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-2 mb-4 group">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#FF7675] group-hover:text-[#64B5F6] transition-colors duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-montserrat text-[#34495E] group-hover:text-[#64B5F6] transition-colors duration-300">
                              {event.time} ({event.duration} hours)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 group">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#74B9FF] group-hover:text-[#64B5F6] transition-colors duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="font-montserrat text-[#34495E] group-hover:text-[#64B5F6] transition-colors duration-300">
                              {event.location}
                            </span>
                          </div>
                          {event.isPaid && (
                            <div className="flex items-center gap-2 mt-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#F1C40F]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-montserrat font-bold text-[#34495E]">
                                ${event.price.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {(event.host || event.hostDescription) && (
                            <>
                              <hr className="m-4" />
                              <p>Host Info:</p>
                              {event.host && (
                                <div className="flex items-center gap-2 mt-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 text-[#239c25]"
                                  >
                                    <path
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.5"
                                      d="M19.618 21.25c0-3.602-4.016-6.53-7.618-6.53s-7.618 2.928-7.618 6.53M12 11.456a4.353 4.353 0 1 0 0-8.706a4.353 4.353 0 0 0 0 8.706"
                                    />
                                  </svg>
                                  <p className="font-montserrat text-[#34495E]">
                                    {event.host}
                                  </p>
                                </div>
                              )}
                              {event.hostDescription && (
                                <div className="flex items-center gap-2 mt-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    className="h-5 w-5 text-[#3f3dcf]"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M2.5 5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1zM2 11.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1z"
                                    />
                                  </svg>
                                  <p className="font-montserrat text-[#34495E]">
                                    {event.hostDescription}
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                          {user && user.role === "client" && (
                            <div className="pt-4">
                              <button
                                onClick={() => handleJoinEvent(event.id)}
                                className={`mt-5 w-full font-montserrat font-semibold py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${"bg-[#E3F2FD] text-[#64B5F6] hover:bg-[#64B5F6] hover:text-white"}`}
                              >
                                Join Event
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 flex flex-col items-center justify-center py-10">
                      <svg
                        className="w-16 h-16 text-black/20 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-black/60 font-montserrat text-lg">
                        No Upcoming Event right now
                      </p>
                      <p className="text-black/40 font-montserrat text-sm mt-2">
                        New Event will appear here when scheduled
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
          {/* Create Event Modal */}
          <EventModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateEvent}
          />
        </div>
      )}
    </>
  );
};

export default Event;
