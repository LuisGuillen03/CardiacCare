import bcrypt from "bcrypt"
import {config} from 'dotenv'
import { register } from "./data.controller";
config();

const helpers = {};

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

helpers.rolcap= (Id_Rol) =>{
  const powers={};
  switch(Id_Rol){
    case 1:
      powers.rendimiento=true;
      break;
    case 2:
      powers.salud=true
      break
    case 3:
      powers.rendimiento=true
      powers.salud=true
      powers.register=true
      break;
  }
  return powers;
}

export default helpers