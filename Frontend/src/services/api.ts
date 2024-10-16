/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */

// import dotenv from 'dotenv';
// dotenv.config();

import axios from "axios";


//var nodeEnv = process.env.REACT_APP_API_PROD_URL; 

const baseurl = "https://projeto-list-git-main-developmentlist.vercel.app"

export const api = axios.create({
  baseURL: baseurl,
});


export const login = async (login: string, password: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.post("/login", { login, password });
    return response.data;
    
  } catch (error) {
    throw error;
  }
  
};



export const register = async (
  gender: string,
  name: string,
  email: string,
  cellphone: string,
  holderid: string,
  password: string,
  adminUser: boolean,
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.post("/register", {
      gender,
      name,
      email,
      cellphone,
      holderid,
      password,
      adminUser,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refresh = async (refresh_token: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.post("/refreshtoken", { refresh_token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (userId: unknown,token: unknown) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.get(`/getAlltask?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDataUsers = async (userId: unknown,token: unknown) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.get(`/getDataUsers?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const category = async (userId: unknown, token: unknown) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.get(`/category?userId=${userId}`, { // Use userId como parte do endpoint
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (userId: unknown, token: unknown) => {

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.delete(`/deletecategory?id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    return response.data
  } catch (error) {
    throw error;
  }

}

export const updateCategory = async (categoryId: unknown, token: unknown, nameCategory: string) => {

    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.put(`/putCategory?categoryId=${categoryId}`,{
        nameCategory
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      return response.data
    } catch (error) {
      throw error;
    }
}


export const registerCategory = async (
  token: unknown,
  nameCategory: string,
  userId: string
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.post(
      "/registerCategory",
      {
        nameCategory,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerTask = async (
  token: unknown,
  nametask: string,
  categoryId: string,
  userId: string
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.post(
      "/registerTask",
      {
        nametask,
        categoryId,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTasks = async (id: unknown, token: unknown, nametask: string) => {

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.put(`/putTask?id=${id}`,{
      nametask
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    return response.data
  } catch (error) {
    throw error;
  }
}

export const deleteTasks = async (id: unknown, token: unknown) => {

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.delete(`/deleteTask?id=${id}`,
   {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    return response.data
  } catch (error) {
    throw error;
  }
}

export const notifications = async (userId: unknown,token: unknown,) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.get(
      `/getnotification?userId=${userId}`,{
        headers: {
          Authorization: `Bearer ${token} `,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const SendEmail = async (to: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
     const service = "gmail";
     const user = "rhipmasterltda@gmail.com";
     const pass = "iywp rehm qptt cijm";
     const from = "REDEFINIR SENHA <rhipmasterltda@gmail.com";
     const subject = "NOVA SENHA";
     const text = "Olá, acesse esse link para redirecionar a tela de nova senha: https://frontend-developmentlist.vercel.app/Redefinir-senha";

    const response = await api.post("/sendEmail", {service,user,pass,from,subject,text, to });
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const Newpassword = async (userId: unknown, newpassword: string, repeatNewpassword: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.put(`/newPassword?userId=${userId}`,{
      newpassword,
      repeatNewpassword
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GeneratePDF = async (userId: unknown,token: unknown,) => {

// eslint-disable-next-line no-useless-catch
try {
  const response = await api.post(`/generatePdf`, {
    userId
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
} catch (error) {
  throw error;
}

};

export const GetPDF = async (userId: unknown,token: unknown,) => {

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.get(`/pdf?userId=${userId}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token} `,
      },
  });
    return response.data
  } catch (error) {
    throw error;
  }
  
  };