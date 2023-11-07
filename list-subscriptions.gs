
let toString = obj => Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(', ');

function listSubscriptions() {
  try {
    const fromMap = {};
    let nextPageToken;
    do {
      const response = Gmail.Users.Messages.list("me", {
        pageToken: 1,
        q: "unsubscribe",
        includeSpamTrash: true,
        maxResults: 500,
        pageToken: nextPageToken || ""
      });
      console.log(response.messages.length);
      nextPageToken = response.nextPageToken;

      const messages = response.messages;
      messages.forEach(function({id}) {
        const m = Gmail.Users.Messages.get("me", id);
        const p = m.payload;
        const h = p.headers;
        const x = h.find(h => h.name === "From")?.value;
        if (fromMap[x]) {
          fromMap[x] += 1;
        } else {
          fromMap[x] = 1;
        }
      })
    } while (nextPageToken);

    console.log(toString(fromMap));
  } catch (err) {
    console.log('Something went wrong');
    console.log(err);
  }
}
