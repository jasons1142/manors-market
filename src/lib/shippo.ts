export async function shippoRequest(path: string, body: unknown) {
    const res = await fetch(`https://api.goshippo.com${path}`, {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
        "Content-Type": "application/json",
        "SHIPPO-API-VERSION": "2018-02-08",
      },
      body: JSON.stringify(body),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      console.error("SHIPPO_ERROR", data);
      throw new Error("Shippo request failed.");
    }
  
    return data;
  }