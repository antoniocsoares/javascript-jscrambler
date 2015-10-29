import Q from 'q';

import config from './config';
import JScramblerClient from './client';
import {
  addApplicationSource,
  createApplication,
  updateApplication,
  updateApplicationSource,
  removeSourceFromApplication
} from './mutations';
import {
  getApplication,
  getApplicationSource
} from './queries';

export default
/** @lends jScramblerFacade */
{
  Client: JScramblerClient,
  config: config,
  createApplication (client, data, fragments) {
    const deferred = Q.defer();
    client.post('/', createApplication(data, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  updateApplication (client, application, fragments) {
    const deferred = Q.defer();
    client.post('/', updateApplication(application, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  getApplication (client, applicationId, fragments) {
    const deferred = Q.defer();
    client.get('/', getApplication(applicationId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  getApplicationSource (client, sourceId, fragments) {
    const deferred = Q.defer();
    client.get('/', getApplicationSource(sourceId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  addApplicationSource (client, applicationId, applicationSource, fragments) {
    const deferred = Q.defer();
    client.post('/', addApplicationSource(applicationId, applicationSource, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  updateApplicationSource (client, applicationSource, fragments) {
    const deferred = Q.defer();
    client.post('/', updateApplicationSource(applicationSource, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  removeSourceFromApplication (client, sourceId, applicationId, fragments) {
    const deferred = Q.defer();
    client.post('/', removeSourceFromApplication(sourceId, applicationId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  }
};

function responseHandler (deferred) {
  return (err, res) => {
    const body = res.body;
    try {
      if (err) deferred.reject(err);
      else if (res.statusCode >= 400) {
        if (Buffer.isBuffer(body)) {
          deferred.reject(JSON.parse(body));
        } else {
          deferred.reject(body);
        }
      } else {
        if (Buffer.isBuffer(body)) {
          deferred.resolve(JSON.parse(body));
        } else {
          deferred.resolve(body);
        }
      }
    } catch (ex) {
      deferred.reject(body);
    }
  };
}

function errorHandler (res) {
  if (res.errors && res.errors.length) {
    res.errors.forEach(function (error) {
      console.error(error.message);
    });
  }

  return res;
}
