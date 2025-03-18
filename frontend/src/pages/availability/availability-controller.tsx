import { useEffect, useState } from "react";
import type { TimeSlot } from "../../utils/types";
import {
  useCreateAvailibility,
  useDeleteAvailibility,
  useGetAllUsers,
  useGetAvailibility,
  useUpdateAvailibility,
} from "./services";
import { formatDate } from "../../utils/enum";
import { useUser } from "../../context/user-context";
import { useNavigate, useParams } from "react-router-dom";
import useRequestReschedule from "./services/reschedule-request";
import { IRequestRescheduleData } from "../../types";
import { toast } from "react-toastify";
import { useGetAllOrganization } from "../organization/services";
import { MENDING_MIND_ID } from "../../utils/enum";

const useAvailabilityController = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] =
    useState(false);
  const [editSlot, setEditSlot] = useState<TimeSlot | undefined>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const getAvailibility = useGetAvailibility(
    formatDate(selectedDate).toString(),
    organizationId
  );

  const getAllOrganization = useGetAllOrganization();
  const addAvailability = useCreateAvailibility(organizationId);
  const deleteAvailibility = useDeleteAvailibility();
  const updateAvailibility = useUpdateAvailibility();
  const requestReschedule = useRequestReschedule();
  const getTherapists = useGetAllUsers(organizationId);

  const isUserInOrganization =
    getAllOrganization.data && getAllOrganization?.data?.length > 1;
  const formatTimeRange = (startTime: string, endTime: string) => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = Number.parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddSlot = (
    startTime: string,
    endTime: string,
    type: "online" | "offline",
    slotId?: string,
    therapistId?: string
  ) => {
    const newSlot: {
      date: string;
      type: "online" | "offline";
      startTime: string;
      endTime: string;
      availibilityId?: string;
      therapistId?: string;
    } = {
      date: formatDate(selectedDate),
      type,
      startTime,
      endTime,
      therapistId,
    };
    if (slotId) {
      newSlot.availibilityId = slotId;
      newSlot.availibilityId && updateAvailibility.mutate(newSlot);
      return;
    }
    addAvailability.mutate(newSlot);
  };

  const handleDeleteSlot = (slotId: string) => {
    deleteAvailibility.mutate(slotId);
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 6; // 0 is Sunday, 6 is Saturday
  };

  const isDayDisabled = (date: Date) => {
    if (organizationId !== MENDING_MIND_ID) {
      return isPastDate(date) || date.getDay() !== 6;
    }
    return isPastDate(date) || (isUserInOrganization && isWeekend(date));
  };

  const getDaySlots = (date: Date) => {
    if (!slots) return [];
    return slots.filter((slot) => slot.date === formatDate(date));
  };

  const selectedDaySlots = getDaySlots(selectedDate);

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="h-14" />);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const daySlots = getDaySlots(date);
      const hasSlots = daySlots && daySlots.length > 0;
      const isDisabled = isDayDisabled(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={isDisabled}
          className={`h-14 rounded-2xl flex items-center justify-center relative
              ${isSelected ? "bg-emerald-600 text-white" : "hover:bg-gray-100"}
              ${hasSlots ? "font-semibold" : ""}
              ${isDisabled ? "text-gray-400 cursor-not-allowed" : ""}
            `}
          title={`
          ${isDisabled ? "Can't Select" : ""}
          ${!isSelected && !isDisabled ?'Click to select':""}
          
          `}
        >
          {day}
          {hasSlots && (
            <div className="absolute bottom-2 w-1 h-1 bg-emerald-600 rounded-full" />
          )}
        </button>
      );
    }

    return days;
  };

  const onEditClick = (slot: TimeSlot) => {
    setEditSlot(slot);
    setIsModalOpen(true);
  };

  const onRescheduleClick = (slot: TimeSlot) => {
    setEditSlot(slot);
    setIsRescheduleModalVisible(true);
  };

  const isSlotInPast = (slot: TimeSlot) => {
    const now = new Date();
    const slotDate = new Date(selectedDate);
    const [startHours, startMinutes] = slot.startTime.split(":").map(Number);
    const slotStartTime = new Date(
      slotDate.setHours(startHours, startMinutes, 0, 0)
    );

    return slotStartTime < now;
  };

  const onRescheduleModalSubmit = (data: IRequestRescheduleData) => {
    requestReschedule.mutate(data);
  };

  useEffect(() => {
    if (requestReschedule.isSuccess) {
      setIsRescheduleModalVisible(false);
      setEditSlot(undefined);
      toast.success("Reschedule request sent successfully");
    }
  }, [requestReschedule.isSuccess]);

  useEffect(() => {
    if (getAvailibility.isSuccess && getAvailibility.data) {
      setSlots(getAvailibility.data.availibility || []);
    }
  }, [getAvailibility.isSuccess, getAvailibility.data]);

  useEffect(() => {
    if (addAvailability.isSuccess) {
      toast.success("Slot added Successfully.")
      getAvailibility.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addAvailability.isSuccess]);

  useEffect(() => {
    if (deleteAvailibility.isSuccess) {
      toast.success("Slot Deleted Successfully.")
      getAvailibility.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteAvailibility.isSuccess]);

  useEffect(() => {
    if (updateAvailibility.isSuccess) {
      toast.success("Slot Details Updated Successfully.")
      getAvailibility.refetch();
      setEditSlot(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateAvailibility.isSuccess]);

  useEffect(() => {
    if (user && user?.role === "client") {
      navigate("/");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, user]);

  return {
    selectedDate,
    setSelectedDate,
    isModalOpen,
    setIsModalOpen,
    slots,
    setSlots,
    handleDateClick,
    handleAddSlot,
    handleDeleteSlot,
    isPastDate,
    isDayDisabled,
    selectedDaySlots,
    generateCalendarDays,
    formatDate,
    formatTimeRange,
    isLoading:
      getAvailibility.isLoading ||
      getAllOrganization.isLoading ||
      getTherapists.isLoading,
    editSlot,
    onEditClick,
    setEditSlot,
    isRescheduleModalVisible,
    setIsRescheduleModalVisible,
    onRescheduleClick,
    isSlotInPast,
    onRescheduleModalSubmit,
    isUserInOrganization,
    therapists: getTherapists.data?.users,
  };
};

export default useAvailabilityController;
