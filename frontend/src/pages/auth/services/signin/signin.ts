import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  IAuthData,
  IAuthResponse,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const signin = async (signIn: IAuthData) => {
  const result = await apiClient.post<IAuthData, IAxiosResponse<IAuthResponse>>(
    APIS_ROUTES.SIGNIN,
    signIn
  );

  return result.data.Data;
};

const useSignin = () =>
  useMutation<IAuthResponse, IAPIError, IAuthData>(
    [API_MUTATION_KEY.SIGNIN],
    signin
  );

export default useSignin;
