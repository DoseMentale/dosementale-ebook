const token = process.env.CLOUDFLARE_API_TOKEN;
const target = "a3d862b3-fe65-4e41-b637-0a8cd6e83783";
if (!token) {
  console.error("missing token");
  process.exit(1);
}

function cf(path, method) {
  return fetch("https://api.cloudflare.com/client/v4" + path, {
    method: method || "GET",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }
  }).then(function (res) { return res.json(); }).then(function (json) {
    if (!json.success) {
      console.error(JSON.stringify(json.errors));
      process.exit(1);
    }
    return json.result;
  });
}

cf("/accounts?per_page=20").then(function (accounts) {
  const account = accounts[0].id;
  return cf("/accounts/" + account + "/pages/projects/dosementale-ebook/deployments/" + target + "/rollback", "POST");
}).then(function () {
  console.log("restored", target);
}).catch(function (err) {
  console.error(err);
  process.exit(1);
});
