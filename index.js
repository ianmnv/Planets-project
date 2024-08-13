const { parse } = require("csv-parse");
const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-type": "application/json" });
  res.end(JSON.stringify({ id: 1, name: "Ian" }));
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});

const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet.koi_disposition === "CONFIRMED" &&
    planet.koi_prad < 1.6 &&
    planet.koi_insol < 1.11 &&
    planet.koi_insol > 0.36
  );
}

fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitable(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (error) => console.log(error))
  .on("end", () => {
    console.log(`${habitablePlanets.length} habitable planets`);
    console.log("done with stream");
  });
