import axios from "axios";

export async function POST(request) {
  const { urls } = await request.json();
  try {
    const data = []; //store all links
    for (let url of urls) {
      //check for empty url
      url = url.trim();
      if (url.length === 0) continue;

      const response = await axios.get(url);
      const html = await response.data;
      const links = getLinksFromHtml(html);

      const results = await Promise.all(
        links.map(async (link) => {
          link = link.trim();
          try {
            const linkResponse = await axios.head(
              link.startsWith("/") ? url + link : link
            );
            return {
              url: link.startsWith("/") ? url + link : link,
              status: linkResponse.status,
            };
          } catch (error) {
            return {
              url: link.startsWith("//")
                ? "https:" + link
                : link.startsWith("/")
                ? url + link
                : link.startsWith("#")
                ? ""
                : link,
              status: 404,
            };
          }
        })
      );
      data.push(...results);
    }
    //remove duplicates
    const filteredData = [
      ...new Map(data.map((item) => [item["url"], item])).values(),
    ];
    return Response.json(filteredData, { status: 200 });
  } catch (error) {
    console.error("Error fetching URL:", error);
    return Response.error(error, { status: 500 });
  }
}

//find all links in html
function getLinksFromHtml(html) {
  const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
  const links = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    links.push(match[2]);
  }
  return links;
}
