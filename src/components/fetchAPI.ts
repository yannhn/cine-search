export class FetchAPI {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(url: string) {
    try {
      const response = await fetch(this.baseUrl + url);
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
