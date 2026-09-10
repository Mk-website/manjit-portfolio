import Certification from '../models/Certification.js';
import {makeCrudRouter} from './crudFactory.js';
export default makeCrudRouter(Certification,{publicFilter:{isActive:true},publicSort:{issueDate:-1}});