import axios from 'axios';
import { backendUri } from './Config';

class FlaskClientSingleton {
  private backendUri;

  public constructor(uri: string) {
    this.backendUri = uri;
  }

  public async get(endpoint: string, params?: any) {
    const getRequest = await axios.get(`${this.backendUri}/${endpoint}`, params);
    console.log('request');
    console.log(getRequest);
  }

  public async post(endpoint: string, params?: any) {
    const postRequest = await axios.post(`${this.backendUri}/${endpoint}`, params);
    console.log('request');
    console.log(postRequest);
  }
}

const FlaskClient = new FlaskClientSingleton(backendUri);
export default FlaskClient;
