// authService.js
import axios from 'axios';
import axiosInstance from './axiosInstance';
import { setEncryptedData,getDecryptedData,removeData } from '../utils/helperFunctions';

let accessToken = getDecryptedData('accessToken');
let refreshToken = getDecryptedData('refreshToken');

export const setAccessToken = (newAccessToken, newRefreshToken) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    setEncryptedData('accessToken', newAccessToken,180);
    setEncryptedData('refreshToken', newRefreshToken,180);
};

export const setOrgAccessToken= (newAccessToken, newRefreshToken) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    setEncryptedData('accessTokenOrg', newAccessToken,180);
    setEncryptedData('refreshTokenOrg', newRefreshToken,180);
};

export const setSuperAccessToken = (newAccessToken, newRefreshToken) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    setEncryptedData('accessTokenSuper', newAccessToken,180);
    setEncryptedData('refreshTokenSuperadmin', newRefreshToken,180);
};


export const getAccessToken = () => {
    return accessToken || getDecryptedData('accessToken');
};

export const getAccessTokenSuperadmin = () => {
    return accessToken || getDecryptedData('accessTokenOrg');
};

export const getAccessTokenOrg = () => {
    return accessToken || getDecryptedData('accessTokenOrg');
};

export const refresh_Token = async () => {
    const token = refreshToken || getDecryptedData('refreshToken');
    if (!token) throw new Error('No refresh token available');

    const response = await axiosInstance.post('https://api.lernen-hub.de/api/token/refresh/', { 
        "refresh":token
     });
    if (response.status === 200) {
        // console.log("Refreshed token",response.data)
        // const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        setAccessToken(response.data.access, response.data.refresh);
    } else {
        throw new Error('Unable to refresh token');
    }
};

