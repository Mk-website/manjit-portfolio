import Experience from '../models/Experience.js';
import {makeCrudRouter} from './crudFactory.js';
export default makeCrudRouter(Experience,{publicFilter:{isActive:true},publicSort:{displayOrder:1,startDate:-1}});