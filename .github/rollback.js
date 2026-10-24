const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("missing token");
  process.exit(1);
}

function cf(path, method) {
  return fetch("https://api.cloudflare.com/client/v4" + path, {
    method: method || "GET",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }
  }).then(function (res) {
    return res.json();
  }).then(function (json) {
    if (!json.success) {
      console.error(JSON.stringify(json.errors));
      process.exit(1);
    }
    return json.result;
  });
}

cf("/accounts?per_page=20").then(function (accounts) {
  const account = accounts[0];
  console.log("account", account.name);
  return cf("/accounts/" + account.id + "/pages/projects/dosementale-ebook/deployments?per_page=20").then(function (deps) {
    deps.forEach(function (d, i) {
      const stage = d.latest_stage ? d.latest_stage.name + ":" + d.latest_stage.status : "";
      console.log(i, d.id, d.environment, d.created_on, stage);
    });
    const previous = deps.find(function (d, i) {
      return i > 0 && d.environment === "production" && d.latest_stage && d.latest_stage.status === "success";
    });
    if (!previous) {
      console.error("no previous production deployment");
      process.exit(1);
    }
    console.log("rollback", previous.id, previous.created_on);
    return cf("/accounts/" + account.id + "/pages/projects/dosementale-ebook/deployments/" + previous.id + "/rollback", "POST");
  });
}).then(function () {
  console.log("restored");
}).catch(function (err) {
  console.error(err);
  process.exit(1);
});
