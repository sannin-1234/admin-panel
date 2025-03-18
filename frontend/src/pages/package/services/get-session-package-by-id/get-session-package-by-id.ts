import { useQuery } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
    IAPIError,
    IAxiosResponse,
} from "../../../../types";
import { API_QUERY_KEY, APIS_ROUTES } from "../../../../utils/enum";

interface ISessionPackage {
    _id: string;
    name: string;
    therapistId: string;
    clientId: string;
    sessionId: string;
    status: string;
    totalSessions: string;
    sessions: string[];
    goals: string[];
    installmentStatus: string;
    date: string;
    clientName: string;
    therapistName: string;
}

const getSessionPackageById = async (sessionId: string) => {
    const result = await apiClient.get<
        null,
        IAxiosResponse<ISessionPackage[]>
    >(`${APIS_ROUTES.SESSION_PACKAGE_SERVICE}/${sessionId}`);

    return result.data.Data;
};

const useGetSessionPackageById = (sessionId: string) =>
    useQuery<ISessionPackage[], IAPIError>(
        [API_QUERY_KEY.GET_ALL_SESSION_PACKAGES, sessionId],
        () => getSessionPackageById(sessionId),
        {
            cacheTime: 0,
        }
    );

export default useGetSessionPackageById;
