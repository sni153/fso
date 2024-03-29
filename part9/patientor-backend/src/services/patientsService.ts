import patientsData from '../../data/patients';
import { PublicPatient, NewPatient, Patient } from '../types';
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientsData;

const getNonSensitivePatients = (): PublicPatient[] => {
  return patientsData.map(({ ssn: _ssn, ...rest }) => rest);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getNonSensitivePatients,
  addPatient
};

