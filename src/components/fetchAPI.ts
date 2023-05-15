export class FetchAPI {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(url: string) {
    const response = await fetch(this.baseUrl + url);
    const data = await response.json();
    return data;
  }

  async post(url: string, body: any) {
    const response = await fetch(this.baseUrl + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  }
}
