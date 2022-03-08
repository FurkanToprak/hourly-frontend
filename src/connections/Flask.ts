import axios from 'axios';
import { backendUri } from './Config';

class FlaskClientSingleton {
  private backendUri;

  public constructor(uri: string) {
    this.backendUri = uri;
  }

  public async get(params?: any) {
    const getRequest = await axios.get(this.backendUri, params);
    console.log('request');
    console.log(getRequest);
  }

  public async post(params?: any) {
    const postRequest = await axios.post(this.backendUri, params);
    console.log('request');
    console.log(postRequest);
  }
}

const FlaskClient = new FlaskClientSingleton(backendUri);
export default FlaskClient;
