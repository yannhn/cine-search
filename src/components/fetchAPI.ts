export class FetchAPI {
  private baseUrl: string;
  private API_KEY: string;

  constructor(baseUrl: string, API_KEY: string) {
    this.baseUrl = baseUrl;
    this.API_KEY = API_KEY;
  }

  async get(url: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}${url}?api_key=${this.API_KEY}&language=us-US`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("GET-Request error", err);
    }
  }

  async search(type: string, title: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/search/${type}?api_key=${this.API_KEY}&query=${title}&language=us-US`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("GET-Request error", err);
    }
  }
  async discover(type: string, title: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/search/${type}?api_key=${this.API_KEY}&query=${title}&language=us-US`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("GET-Request error", err);
    }
  }

  async post(url: string, body: string) {
    try {
      const response = await fetch(this.baseUrl + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("POST-Request error", err);
    }
  }
}
