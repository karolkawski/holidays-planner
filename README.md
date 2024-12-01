export const config = {
mode: "search", //search | bot
filters: {
from: new Date(),
to: new Date(),
where: null, //'Mexico'
},
scrapper: {
domains: [
{
url: "",
type: "offers",
rss: false,
},
{
url: "",
type: "offers",
rss: false,
},
],
}
};
