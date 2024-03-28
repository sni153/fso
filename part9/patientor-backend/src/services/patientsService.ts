import patients from '../../data/patients';
import { PublicPatient } from '../types';

const getNonSensitivePatients = (): PublicPatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest);
};

export default {
  getNonSensitivePatients,
};

