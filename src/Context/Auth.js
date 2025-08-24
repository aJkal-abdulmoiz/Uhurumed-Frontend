import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { calculateTimeLeft } from '../utils';
import { getDataHandlerWithToken } from './service';
import ApiConfig from '../ApiConfig/ApiConfig';

export const AuthContext = createContext();

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('creatturAccessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('creatturAccessToken');
    localStorage.removeItem('userType');
    delete axios.defaults.headers.common.Authorization;
  }
};

function checkLogin(token) {
  const accessToken = window.localStorage.getItem('UhuruMedToken')
    ? window.localStorage.getItem('UhuruMedToken')
    : token;

  return accessToken ? true : false;
}

export default function AuthProvider(props) {
  const [isLogin, setIsLogin] = useState(checkLogin());
  const [userData, setUserData] = useState({});
  const [actived, setActived] = useState({});
  console.log('activedactived', actived);
  const [endTime, setEndtime] = useState();
  const [counting, setCounting] = useState([]);
  const [timeLeft, setTimeLeft] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [enrollment, setEnrollment] = useState();

  const [socket, setSocket] = useState(null);

  const getProfileData = async () => {
    try {
      const res = await getDataHandlerWithToken('profile');
      if (res) {
        console.log('dsgsadgsadgsa', res);
        setUserData(res);
        localStorage.setItem('userType', res.userType);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  // const getActivatedPlans = async () => {
  //   const token = window.localStorage.getItem('UhuruMedToken');
  //   try {
  //     const response = await axios({
  //       method: 'GET',
  //       url: ApiConfig.activePlan,
  //       headers: {
  //         authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log('asfdadfds', response?.data?.success);
  //     if (response?.data?.error === 'false') {
  //       setActived(response?.data?.data);

  //       // setTotalPages(response?.data?.data?.[0]?.count);
  //     }
  //   } catch (error) {
  //     setActived([]);
  //     console.log('errorerror', error);

  //     return error?.response;
  //   }
  // };

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    console.log('Adfdgsafdgsad', storedData);
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
    // setLoading(false); // done loading
  }, []);

  // useEffect(() => {
  //   const storedUser = window.localStorage.getItem("userData");
  //   console.log("asfadsgsd",storedUser);
  //   if (storedUser) {
  //     setUserData(JSON.parse(storedUser)); // or your state management logic
  //   }
  // }, []);

  useEffect(() => {
    if (localStorage.getItem('UhuruMedToken')) getProfileData();

  }, [localStorage.getItem('UhuruMedToken')]);

  useEffect(() => {
    if (endTime) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(endTime));
      }, 1000);

      return () => clearTimeout(timer);
    }
  });

  let data = {
    userLoggedIn: isLogin,
    userData,
    actived,
    counting,
    setEndtime,
    isLoading,
    timeLeft,
    userLogIn: (type, data) => {
      setSession(data);
      setIsLogin(type);
    },
    setIsLogin,
    getProfileData: () => {
      getProfileData();
    },
    checkLogin: (token) => {
      checkLogin(token);
    },
    socket: socket,
    setEnrollment,
    enrollment,
  };

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  );
}
