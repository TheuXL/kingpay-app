const { default: axios } = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL || 'https://api.kingpay.com.br';

const getAuthToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/v1/token`, {
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token de autenticação:', error);
    throw error;
  }
};

const getDashboardData = async (token, startDate, endDate) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/functions/v1/dados-dashboard`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    throw error;
  }
};

const getTopSellers = async (token, startDate, endDate) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/functions/v1/dados-dashboard/top-sellers`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter top sellers:', error);
    throw error;
  }
};

const getTopProdutos = async (token, startDate, endDate) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/functions/v1/dados-dashboard/top-produtos`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter top produtos:', error);
    throw error;
  }
};

const getGraficoData = async (token, startDate, endDate) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/functions/v1/dados-dashboard/grafico`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados do gráfico:', error);
    throw error;
  }
};

const getInfosAdicionais = async (token, startDate, endDate) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/functions/v1/dados-dashboard/infos-adicionais`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter informações adicionais:', error);
    throw error;
  }
};

const getTopSellersReport = async (token, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/functions/v1/analytics-reports/top-sellers/${startDate}/${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter relatório de top sellers:', error);
    throw error;
  }
};

module.exports = {
  getAuthToken,
  getDashboardData,
  getTopSellers,
  getTopProdutos,
  getGraficoData,
  getInfosAdicionais,
  getTopSellersReport,
}; 