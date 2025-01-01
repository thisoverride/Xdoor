import Joi from 'joi';

const passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/]).+$/)
const emailPattern = /^[a-zA-Z0-9._%+-]{1,64}@live\.rebirth$/;

// Schéma pour l'enregistrement d'un utilisateur
const userRegisterSchema = Joi.object({
  firstname: Joi.string().min(2).max(50).required().messages({
    'string.min': 'USER_REGISTER_FIRSTNAME_MIN',  // Code pour prénom trop court
    'string.max': 'USER_REGISTER_FIRSTNAME_MAX',  // Code pour prénom trop long
    'any.required': 'USER_REGISTER_FIRSTNAME_REQUIRED',  // Code pour prénom requis
    'string.empty': 'USER_REGISTER_FIRSTNAME_EMPTY'  // Code pour prénom vide
  }),
  lastname: Joi.string().min(2).max(50).required().messages({
    'string.min': 'USER_REGISTER_LASTNAME_MIN',  // Code pour nom de famille trop court
    'string.max': 'USER_REGISTER_LASTNAME_MAX',  // Code pour nom de famille trop long
    'any.required': 'USER_REGISTER_LASTNAME_REQUIRED',  // Code pour nom de famille requis
    'string.empty': 'USER_REGISTER_LASTNAME_EMPTY'  // Code pour nom de famille vide
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'USER_REGISTER_EMAIL_INVALID',  // Code pour email invalide
    'any.required': 'USER_REGISTER_EMAIL_REQUIRED',  // Code pour email requis
    'string.empty': 'USER_REGISTER_EMAIL_EMPTY'  // Code pour email vide
  }),
  rebirth_id: Joi.string().pattern(emailPattern).required().messages({
    'string.pattern.base': 'USER_REGISTER_REBIRTH_ID_INVALID',  // Code pour rebirth_id invalide
    'any.required': 'USER_REGISTER_REBIRTH_ID_REQUIRED',  // Code pour rebirth_id requis
    'string.empty': 'USER_REGISTER_REBIRTH_ID_EMPTY'  // Code pour rebirth_id vide
  }),
  password: Joi.string().min(8).max(50).pattern(passwordPattern).required().messages({
    'string.min': 'USER_REGISTER_PASSWORD_TOO_SHORT',  // Code pour mot de passe trop court
    'string.max': 'USER_REGISTER_PASSWORD_TOO_LONG',  // Code pour mot de passe trop long
    'string.pattern.base': 'USER_REGISTER_PASSWORD_INVALID',  // Code pour mot de passe invalide
    'any.required': 'USER_REGISTER_PASSWORD_REQUIRED',  // Code pour mot de passe requis
    'string.empty': 'USER_REGISTER_PASSWORD_EMPTY'  // Code pour mot de passe vide
  }),
  date_of_birth: Joi.date().required().messages({
    'date.base': 'USER_REGISTER_DATE_OF_BIRTH_INVALID',  // Code pour date de naissance invalide
    'any.required': 'USER_REGISTER_DATE_OF_BIRTH_REQUIRED'  // Code pour date de naissance requise
  })
});

// Schéma pour la connexion d'un utilisateur
const userLoginSchema = Joi.object({
  rebirth_id: Joi.string().pattern(emailPattern).required().messages({
    'string.pattern.base': 'USER_LOGIN_REBIRTH_ID_INVALID',  // Code pour rebirth_id invalide
    'any.required': 'USER_LOGIN_REBIRTH_ID_REQUIRED',  // Code pour rebirth_id requis
    'string.empty': 'USER_LOGIN_REBIRTH_ID_EMPTY'  // Code pour rebirth_id vide
  }),
  password: Joi.string().min(8).max(50).pattern(passwordPattern).required().messages({
    'string.min': 'USER_LOGIN_PASSWORD_TOO_SHORT',  // Code pour mot de passe trop court
    'string.max': 'USER_LOGIN_PASSWORD_TOO_LONG',  // Code pour mot de passe trop long
    'string.pattern.base': 'USER_LOGIN_PASSWORD_INVALID',  // Code pour mot de passe invalide
    'any.required': 'USER_LOGIN_PASSWORD_REQUIRED',  // Code pour mot de passe requis
    'string.empty': 'USER_LOGIN_PASSWORD_EMPTY'  // Code pour mot de passe vide
  })
});

// Schéma pour la mise à jour du profil utilisateur
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional().allow('').messages({
    'string.min': 'UPDATE_PROFILE_FIRSTNAME_MIN',  // Code pour prénom trop court
    'string.max': 'UPDATE_PROFILE_FIRSTNAME_MAX',  // Code pour prénom trop long
    'string.empty': 'UPDATE_PROFILE_FIRSTNAME_EMPTY'  // Code pour prénom vide
  }),
  lastName: Joi.string().min(2).max(50).optional().allow('').messages({
    'string.min': 'UPDATE_PROFILE_LASTNAME_MIN',  // Code pour nom de famille trop court
    'string.max': 'UPDATE_PROFILE_LASTNAME_MAX',  // Code pour nom de famille trop long
    'string.empty': 'UPDATE_PROFILE_LASTNAME_EMPTY'  // Code pour nom de famille vide
  }),
  password: Joi.string().min(8).max(50).pattern(passwordPattern).optional().messages({
    'string.min': 'UPDATE_PROFILE_PASSWORD_TOO_SHORT',  // Code pour mot de passe trop court
    'string.max': 'UPDATE_PROFILE_PASSWORD_TOO_LONG',  // Code pour mot de passe trop long
    'string.pattern.base': 'UPDATE_PROFILE_PASSWORD_INVALID',  // Code pour mot de passe invalide
    'string.empty': 'UPDATE_PROFILE_PASSWORD_EMPTY'  // Code pour mot de passe vide
  })
});

export {
  userRegisterSchema,
  userLoginSchema,
  updateProfileSchema,
};
