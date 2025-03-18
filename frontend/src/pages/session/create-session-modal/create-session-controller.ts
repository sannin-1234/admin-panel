import { useEffect, useState } from "react";
import { CreateSessionForm } from "../../../utils/types";
import {
  useAddUser,
  useCheckAvailibility,
  useCreateSession,
  useGetAllUsers,
} from "../services";
import { IUsers } from "../../../types";
import { IAddUser } from "../services/add-user/add-user";
import { useParams } from "react-router-dom";

interface CreateSessionControllerProps {
  onClose: () => void;
}

const useCreateSessionController = ({
  onClose,
}: CreateSessionControllerProps) => {
  const { organizationId } = useParams<{
    organizationId: string;
  }>();
  const [allTherapists, setAllTherapists] = useState<IUsers[]>([]);
  const [allPatients, setAllPatients] = useState<IUsers[]>([]);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean>(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    { startTime: string; endTime: string }[]
  >([]);
  const [form, setForm] = useState<CreateSessionForm>({
    therapist: "",
    patient: "",
    meetingName: "",
    type: "",
    duration: "30m",
    date: "",
    time: "",
    isNewClient: false,
    autoConfirm: false,
    paymentType: "free",
    location: "",
  });

  const getAllUsers = useGetAllUsers(organizationId);
  const availabilityQuery = useCheckAvailibility(
    form.therapist,
    form.date,
    organizationId
  );
  const createNewClient = useAddUser(organizationId);
  const createSessionMutation = useCreateSession(organizationId);

  useEffect(() => {
    if (getAllUsers.isSuccess && getAllUsers.data) {
      const therapists = getAllUsers.data.users.filter(
        (user) => user.role === "therapist"
      );
      const patients = getAllUsers.data.users.filter(
        (user) => user.role === "client"
      );
      setAllTherapists(therapists);
      setAllPatients(patients);
    }
  }, [getAllUsers.isSuccess, getAllUsers.data]);

  const handleAddPatient = async (patientData: IAddUser) => {
    try {
      const newPatient = await createNewClient.mutateAsync(patientData);
      // Update the patients list with the new patient
      setAllPatients((prev) => [...prev, newPatient.user]);
      // // Optionally, select the new patient in the form
      setForm((prev) => ({
        ...prev,
        patient: newPatient.user._id,
        isNewClient: true,
      }));
    } catch (error) {
      console.error("Error adding patient:", error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  useEffect(() => {
    if (availabilityQuery.data?.availibility) {
      // Extract only available slots where status is "available" and no client is assigned
      const slots = availabilityQuery.data.availibility
        .filter((slot) => slot.status === "available" && !slot.clientId)
        .map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
        }));

      setAvailableTimeSlots(slots);

      // Reset selected time if it's not in available slots anymore
      if (form.time && !slots.some((slot) => slot.startTime === form.time)) {
        setForm((prev) => ({ ...prev, time: "" }));
      }
    } else {
      setAvailableTimeSlots([]);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availabilityQuery.data]);

  const handleCreateSession = async () => {
    try {
      const sessionDateTime = `${form.date}T${form.time}:00`;

      const sessionData = {
        therapistId: form.therapist,
        clientId: form.patient,
        sessionDateTime,
        duration: form.duration,
        location: form.location,
        isNewClient: form.isNewClient,
        isPaid: form.paymentType !== "free",
        type: form.type,
        name: form.meetingName,
        sessionId: "", // This will be generated by the backend
      };

      await createSessionMutation.mutateAsync(sessionData);
      onClose();
    } catch (error) {
      console.error("Error creating session:", error);
      // You might want to add error handling/notification here
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateSession();
  };

  // Check availability when the data changes
  useEffect(() => {
    if (availabilityQuery.data?.availibility && form.time) {
      const selectedTime = form.time;

      // Find if the time slot is booked
      const isTimeBooked = availabilityQuery.data.availibility.some((slot) => {
        return (
          slot.startTime === selectedTime &&
          slot.status === "available" &&
          !slot.clientId
        );
      });

      // Set availability - true if time is booked
      setIsSlotAvailable(isTimeBooked);
    } else {
      setIsSlotAvailable(false);
    }
  }, [availabilityQuery.data, form.time]);

  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "pm" : "am";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${
      displayHour > 9 ? displayHour : `0${displayHour}`
    }:${minutes} ${period}`;
  };

  return {
    form,
    setForm,
    handleSubmit,
    allTherapists,
    allPatients,
    isSlotAvailable,
    showAddPatientModal,
    setShowAddPatientModal,
    handleAddPatient,
    isCheckingAvailability: availabilityQuery.isLoading,
    handleCreateSession: handleSubmit,
    formatTimeForDisplay,
    availableTimeSlots,
  };
};

export default useCreateSessionController;
