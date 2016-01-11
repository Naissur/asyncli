import yup from 'yup';
// import is from 'is';
import {LOG_INFO, LOG_ERROR, EXIT_ACTION} from './constants';
import Promise from 'bluebird';


export const LOG_INFO_ACTION_SCHEMA = 
  yup.object().required().shape({
    type: yup.mixed().oneOf([LOG_INFO]),
    message: yup.string().required()
  });

export const LOG_ERROR_ACTION_SCHEMA = 
  yup.object().required().shape({
    type: yup.mixed().oneOf([LOG_ERROR]),
    message: yup.string().required()
  });

export const LOG_ACTION_SCHEMA = 
  yup.mixed().test('is either INFO or ERROR log action', '${path} is not a valid logging action', 
    action => Promise.any([
      LOG_INFO_ACTION_SCHEMA.validate(action, {strict: true}),
      LOG_ERROR_ACTION_SCHEMA.validate(action, {strict: true})
    ]).then(() => true, () => false)
  );

export const EXIT_ACTION_SCHEMA = 
  yup.object().required().shape({
    type: yup.mixed().oneOf([EXIT_ACTION])
  });
