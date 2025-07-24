import supabase from "../../../config/supabaseClient";

export const getWalletData = async () => {
  const { data, error } = await supabase.functions.invoke('wallet');
  if (error) throw new Error(error.message);
  return data;
};

export const getDashboardChartData = async () => {
  const { data, error } = await supabase.functions.invoke('dados-dashboard/grafico');
  if (error) throw new Error(error.message);
  return data;
};

export const getUserData = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data.user;
} 