import axios from 'axios';
import { backendUri } from './Config';

class FlaskClientSingleton {
  private backendUri;

  public constructor(uri: string) {
    this.backendUri = uri;
  }

  public async get(endpoint: string, params?: any) {
    const getRequest = await axios.get(`${this.backendUri}/${endpoint}`, params);
    return getRequest.data;
  }

  public async post(endpoint: string, params?: any) {
    const postRequest = await axios.post(`${this.backendUri}/${endpoint}`, params);
    return postRequest.data;
  }

  public async postFormData(endpoint: string, formData: FormData) {
    const postRequest = await axios.post(`${this.backendUri}/${endpoint}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return postRequest.data;
  }
}

const FlaskClient = new FlaskClientSingleton(backendUri);
export default FlaskClient;
